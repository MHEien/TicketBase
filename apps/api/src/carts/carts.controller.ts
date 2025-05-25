import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Cart } from './entities/cart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationGuard } from '../auth/guards/organization.guard';

@ApiTags('carts')
@Controller('api/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart' })
  @ApiResponse({
    status: 201,
    description: 'The cart has been successfully created.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, OrganizationGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find all carts for an organization' })
  @ApiResponse({
    status: 200,
    description: 'Returns all carts.',
    type: [Cart],
  })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async findAll(@Query('organizationId') organizationId: string): Promise<Cart[]> {
    return this.cartsService.findAll(organizationId);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Find cart by session ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the cart if found.',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'sessionId', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async findBySession(
    @Param('sessionId') sessionId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    const cart = await this.cartsService.findBySession(sessionId, organizationId);
    if (!cart) {
      throw new BadRequestException('No active cart found for this session');
    }
    return cart;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find cart by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the cart if found.',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async findOne(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.findOne(id, organizationId);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 201,
    description: 'The item has been added to the cart.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or cart is inactive.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  @ApiBody({ type: AddCartItemDto })
  async addItem(
    @Param('id') id: string,
    @Body() addItemDto: AddCartItemDto,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.addItem(id, addItemDto, organizationId);
  }

  @Patch(':id/items/:itemId')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been updated.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Invalid input or cart is inactive.' })
  @ApiResponse({ status: 404, description: 'Cart or item not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiParam({ name: 'itemId', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  @ApiBody({ type: UpdateCartItemDto })
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateCartItemDto,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.updateItem(id, itemId, updateItemDto, organizationId);
  }

  @Delete(':id/items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'The item has been removed from the cart.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Cart is inactive.' })
  @ApiResponse({ status: 404, description: 'Cart or item not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiParam({ name: 'itemId', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.removeItem(id, itemId, organizationId);
  }

  @Patch(':id/customer')
  @ApiOperation({ summary: 'Update customer information' })
  @ApiResponse({
    status: 200,
    description: 'The customer information has been updated.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Cart is inactive.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerInfo: any,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.updateCustomerInfo(id, customerInfo, organizationId);
  }

  @Post(':id/discount')
  @ApiOperation({ summary: 'Apply discount code to cart' })
  @ApiResponse({
    status: 200,
    description: 'The discount has been applied.',
    type: Cart,
  })
  @ApiResponse({ status: 400, description: 'Invalid discount code or cart is inactive.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async applyDiscount(
    @Param('id') id: string,
    @Body('code') discountCode: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.applyDiscount(id, discountCode, organizationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mark cart as abandoned' })
  @ApiResponse({
    status: 200,
    description: 'The cart has been marked as abandoned.',
    type: Cart,
  })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiQuery({ name: 'organizationId', required: true, type: String })
  async abandon(
    @Param('id') id: string,
    @Query('organizationId') organizationId: string,
  ): Promise<Cart> {
    return this.cartsService.markAsAbandoned(id, organizationId);
  }
} 