import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    return this.customersRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Customer> {
    return this.customersRepository.findOne({
      where: { email },
    });
  }

  // Add more methods as needed for your application
} 