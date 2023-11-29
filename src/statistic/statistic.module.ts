import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { OrderModule } from 'src/order/order.module';
import { ReviewModule } from 'src/review/review.module';
import { CartModule } from 'src/cart/cart.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    ProductModule,
    OrderModule,
    ReviewModule,
    CartModule
  ],
  controllers: [StatisticController],
  providers: [StatisticService]
})
export class StatisticModule {}
