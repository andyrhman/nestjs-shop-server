import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/order.entity';
import { OrderItem } from './models/order-item.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CommonModule,
    AuthModule,
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
