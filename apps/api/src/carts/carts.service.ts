import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from '../events/events.service';
import { Cart, CartStatus } from './entities/cart.entity';
import { CartItem, CartItemType } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private eventsService: EventsService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const event = await this.eventsService.findOne(createCartDto.eventId, createCartDto.organizationId);
    if (!event) {
      throw new NotFoundException(`Event with ID ${createCartDto.eventId} not found`);
    }

    // Create cart with expiration time (default 30 minutes)
    const cart = this.cartsRepository.create({
      ...createCartDto,
      sessionId: createCartDto.sessionId || uuidv4(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      status: CartStatus.ACTIVE,
      items: [],
      subtotal: 0,
      fees: 0,
      taxes: 0,
      total: 0,
    });

    return this.cartsRepository.save(cart);
  }

  async findAll(organizationId: string): Promise<Cart[]> {
    return this.cartsRepository.find({
      where: { organizationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, organizationId: string): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { id, organizationId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findBySession(sessionId: string, organizationId: string): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({
      where: { 
        sessionId, 
        organizationId,
        status: CartStatus.ACTIVE
      },
    });

    return cart;
  }

  async addItem(id: string, addItemDto: AddCartItemDto, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    
    // Check if cart is still active
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot add items to an inactive cart');
    }
    
    // Check if cart has expired
    if (new Date() > cart.expiresAt) {
      cart.status = CartStatus.EXPIRED;
      await this.cartsRepository.save(cart);
      throw new BadRequestException('This cart has expired');
    }

    // If ticket item, validate ticket type exists and has available inventory
    if (addItemDto.type === CartItemType.TICKET && addItemDto.ticketTypeId) {
      const ticketType = await this.eventsService.findTicketType(
        cart.eventId, 
        addItemDto.ticketTypeId, 
        organizationId
      );
      
      if (!ticketType) {
        throw new NotFoundException(`Ticket type with ID ${addItemDto.ticketTypeId} not found`);
      }
      
      if (ticketType.availableQuantity < addItemDto.quantity) {
        throw new BadRequestException(`Not enough tickets available. Only ${ticketType.availableQuantity} left.`);
      }
    }

    // Create new cart item
    const subtotal = addItemDto.unitPrice * addItemDto.quantity;
    const newItem = this.cartItemsRepository.create({
      ...addItemDto,
      cartId: id,
      subtotal,
    });

    // Add item to cart
    cart.items = [...cart.items, newItem];
    
    // Recalculate cart totals
    this.recalculateCartTotals(cart);
    
    // Extend expiration time
    cart.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    
    return this.cartsRepository.save(cart);
  }

  async updateItem(id: string, itemId: string, updateItemDto: UpdateCartItemDto, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    
    // Check if cart is still active
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot update items in an inactive cart');
    }
    
    // Find the cart item
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }
    
    const item = cart.items[itemIndex];
    
    // If increasing ticket quantity, validate available inventory
    if (
      item.type === CartItemType.TICKET && 
      updateItemDto.quantity && 
      updateItemDto.quantity > item.quantity
    ) {
      const ticketType = await this.eventsService.findTicketType(
        cart.eventId, 
        item.ticketTypeId, 
        organizationId
      );
      
      const additionalQuantity = updateItemDto.quantity - item.quantity;
      if (ticketType.availableQuantity < additionalQuantity) {
        throw new BadRequestException(`Not enough tickets available. Only ${ticketType.availableQuantity} left.`);
      }
    }
    
    // Update the item
    cart.items[itemIndex] = {
      ...item,
      ...updateItemDto,
      subtotal: (updateItemDto.unitPrice || item.unitPrice) * (updateItemDto.quantity || item.quantity)
    };
    
    // Recalculate cart totals
    this.recalculateCartTotals(cart);
    
    // Extend expiration time
    cart.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    
    return this.cartsRepository.save(cart);
  }

  async removeItem(id: string, itemId: string, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    
    // Check if cart is still active
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot remove items from an inactive cart');
    }
    
    // Find the cart item
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }
    
    // Remove the item
    cart.items.splice(itemIndex, 1);
    
    // Recalculate cart totals
    this.recalculateCartTotals(cart);
    
    // If cart is now empty, set to abandoned
    if (cart.items.length === 0) {
      cart.status = CartStatus.ABANDONED;
    } else {
      // Extend expiration time
      cart.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    }
    
    return this.cartsRepository.save(cart);
  }

  async updateCustomerInfo(id: string, customerInfo: any, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    
    // Check if cart is still active
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot update an inactive cart');
    }
    
    // Update customer info
    cart.customer = customerInfo;
    
    // Extend expiration time
    cart.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    
    return this.cartsRepository.save(cart);
  }

  async applyDiscount(id: string, discountCode: string, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    
    // Check if cart is still active
    if (cart.status !== CartStatus.ACTIVE) {
      throw new BadRequestException('Cannot apply discount to an inactive cart');
    }
    
    // TODO: Implement discount code validation and application
    // For now, just store the code
    cart.discountCode = discountCode;
    
    // Recalculate cart totals with discount
    this.recalculateCartTotals(cart);
    
    return this.cartsRepository.save(cart);
  }

  async markAsAbandoned(id: string, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    cart.status = CartStatus.ABANDONED;
    return this.cartsRepository.save(cart);
  }

  async markAsConverted(id: string, organizationId: string): Promise<Cart> {
    const cart = await this.findOne(id, organizationId);
    cart.status = CartStatus.CONVERTED;
    return this.cartsRepository.save(cart);
  }

  private recalculateCartTotals(cart: Cart): void {
    // Calculate subtotal from items
    cart.subtotal = cart.items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    
    // Calculate fees - this would typically come from organization settings
    // For now, using a simple percentage
    cart.fees = cart.subtotal * 0.05; // 5% service fee
    
    // Calculate taxes - this could be based on location and tax rules
    // For now, using a simple percentage
    cart.taxes = cart.subtotal * 0.08; // 8% tax
    
    // Apply discount if present
    if (cart.discountCode && cart.discountAmount) {
      cart.total = cart.subtotal + cart.fees + cart.taxes - cart.discountAmount;
    } else {
      cart.total = cart.subtotal + cart.fees + cart.taxes;
    }
    
    // Ensure we don't have negative totals
    cart.total = Math.max(0, cart.total);
  }
} 