import { BadRequestException, Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { ProductCreateDto } from './models/product-create.dto';
import { Product } from './models/product.entity';
import slugify from 'slugify';
import { ProductImagesService } from './product-images.service';
import { ProductImages } from './models/product.images';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductUpdateDto } from './models/product-update.dto';
import { isUUID } from 'class-validator';

@Controller()
export class ProductController {
    constructor(
        private productService: ProductService,
        private productImageService: ProductImagesService,
        private userService: UserService,
        private authService: AuthService
    ) { }

    // * Create Products
    @UseGuards(AuthGuard)
    @Post('admin/products')
    async create(
        @Body() body: ProductCreateDto
    ) {
        const p = new Product();
        p.title = body.title;
        p.slug = slugify(body.title, {
            lower: true,
            strict: true,
            trim: true
        });
        p.description = body.description;
        p.image = body.image;
        p.price = body.price;

        const product = await this.productService.create(p);
        for (let i of body.images) {
            const productImages = new ProductImages()
            productImages.productId = product.id
            productImages.image = i
            await this.productImageService.create(productImages)
        }

        return product;
    }

    // * Get one product
    @Get('product/:slug')
    async get(@Param('slug') slug: string) {
        return this.productService.findOne({ slug }, ['product_images']);
    }

    // * Update Products.
    @UseGuards(AuthGuard)
    @Put('admin/product/:id')
    async update(
        @Param('id') id: string,
        @Body() body: ProductUpdateDto
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const products = await this.productService.findOne({id})
        if (!products) {
            throw new BadRequestException("Product not found")
        }
        const findImages = await this.productImageService.findOne({ productId: id });

        if (findImages) {
            await this.productImageService.delete(findImages.productId);
        }

        const p = new Product();
        p.title = body.title;
        p.slug = slugify(body.title, {
            lower: true,
            strict: true,
            trim: true
        });
        p.description = body.description;
        p.image = body.image;
        p.price = body.price;

        await this.productService.update(id, p);
        for (let i of body.images) {
            const productImages = new ProductImages()
            productImages.productId = id
            productImages.image = i
            await this.productImageService.create(productImages)
        }

        return this.productService.findOne({ id });
    }
}
