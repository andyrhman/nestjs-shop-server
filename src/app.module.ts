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
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

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
    MailerModule.forRoot({
      transport:{
        // * Let docker know nodemailer run in local.
        // ? https://www.phind.com/search?cache=rrc34g0tz9oxk331skvds3di
        host: 'host.docker.internal',
        port: 1025,
      },
      defaults: {
        from: 'service@mail.com'
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false
        }
      }
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
