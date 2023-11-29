import { Module, forwardRef } from '@nestjs/common';
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
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    CommonModule,
    AuthModule,
    UserModule,
    forwardRef(() => ProductModule),
    CartModule,
    AddressModule,
    StripeModule.forRootAsync(StripeModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_API_KEY'),
        apiVersion: '2022-11-15'
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: +configService.get<number>('SMTP_PORT'),
          secure: configService.get<string>('SMTP_SECURE') === 'true',
          auth: {
            user: configService.get<string>('SMTP_USERNAME'),
            pass: configService.get<string>('SMTP_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false
          }
        }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OrderService, OrderItemService, OrderListener],
  controllers: [OrderController],
  exports: [OrderService, OrderItemService]
})
export class OrderModule { }
