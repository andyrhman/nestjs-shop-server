import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductImages } from './models/product.images';
import { UploadController } from './upload.controller';
import { ProductImagesService } from './product-images.service';
import { ProductVariation } from './models/product-variation.entity';
import { ProductVariantService } from './product-variant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImages, ProductVariation])
  ],
  providers: [ProductService, ProductImagesService, ProductVariantService],
  controllers: [ProductController, UploadController],
  exports: [ProductService]
})
export class ProductModule {}
