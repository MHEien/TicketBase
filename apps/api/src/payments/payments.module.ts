import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule } from '@nestjs/config';
import { PluginsModule } from '../plugins/plugins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule,
    PluginsModule,
    HttpModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
