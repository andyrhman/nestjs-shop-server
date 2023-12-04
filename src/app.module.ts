import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { AddressModule } from './address/address.module';
import { OrderModule } from './order/order.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ResetModule } from './reset/reset.module';
import { StatisticModule } from './statistic/statistic.module';
import { DatabaseConfig } from './config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      cache: true,
      load: [DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    // * https://www.phind.com/agent?cache=clppilxjn0000l808i2rqhgd5
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
        defaults: {
          from: 'info@kitapendidikan.my.id'
        }
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    UserModule,
    AuthModule,
    ProductModule,
    AddressModule,
    OrderModule,
    CartModule,
    CategoryModule,
    ReviewModule,
    ResetModule,
    StatisticModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
