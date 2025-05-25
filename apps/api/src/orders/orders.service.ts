import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items'],
    });
  }

  async findOne(id: string): Promise<Order> {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  // Add more methods as needed for your application
} 