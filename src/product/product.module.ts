import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductImages } from './models/product.images';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UploadController } from './upload.controller';
import { ProductImagesService } from './product-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImages]),
    AuthModule,
    UserModule,
  ],
  providers: [ProductService, ProductImagesService],
  controllers: [ProductController, UploadController]
})
export class ProductModule {}
