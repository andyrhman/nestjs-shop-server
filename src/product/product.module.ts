import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductImages } from './models/product-images.entity';
import { UploadController } from './upload.controller';
import { ProductImagesService } from './product-images.service';
import { ProductVariation } from './models/product-variation.entity';
import { ProductVariantService } from './product-variant.service';
import { ReviewModule } from 'src/review/review.module';
import { CategoryModule } from 'src/category/category.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImages, ProductVariation]),
    forwardRef(() => ReviewModule),
    CategoryModule,
    CommonModule
  ],
  providers: [ProductService, ProductImagesService, ProductVariantService],
  controllers: [ProductController, UploadController],
  exports: [ProductService, ProductVariantService]
})
export class ProductModule {}
