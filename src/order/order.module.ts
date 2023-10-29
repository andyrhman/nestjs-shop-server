import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './models/order.entity';
import { OrderItem } from './models/order-item.entity';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrderItemService } from './order-item.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { CartModule } from 'src/cart/cart.module';
import { AddressModule } from 'src/address/address.module';
import { StripeModule } from '@golevelup/nestjs-stripe';
import { OrderListener } from './listener/order.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CommonModule,
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    AddressModule,
    StripeModule.forRoot(StripeModule, {
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2022-11-15'
    }),
    // MailerModule.forRoot({
    //   transport:{
    //     host: process.env.SMTP_HOST,
    //     port: parseInt(process.env.SMTP_PORT, 10),
    //     secure: process.env.SMTP_SECURE === 'true',
    //     auth: {
    //       user: process.env.SMTP_USERNAME,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   template: {
    //     dir: join(__dirname, 'templates'),
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: false
    //     }
    //   }
    // }),
  ],
  providers: [OrderService, OrderItemService, OrderListener],
  controllers: [OrderController],
  exports: [OrderService, OrderItemService]
})
export class OrderModule {}
