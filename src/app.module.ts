import { Module } from '@nestjs/common';
import { ConfigurationModule } from 'config/config.module';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigurationModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true, //delete if production
      synchronize: true,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
