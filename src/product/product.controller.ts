import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
import { ProductImagesUpdateDTO } from './models/update-images.dto';
import { Request } from 'express';

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

    // * Get all products
    // * https://www.phind.com/search?cache=uambrl956nwdhj9g2clkh4h8
    @UseGuards(AuthGuard)
    @Get('admin/products')
    async all(
        @Req() request: Request
    ) {
        let products = await this.productService.find({});

        if (request.query.search) {
            const search = request.query.search.toString().toLowerCase();
            products = products.filter(
                p => p.title.toLowerCase().indexOf(search) >= 0 ||
                    p.description.toLowerCase().indexOf(search) >= 0
            )
        }

        return products;
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
        const products = await this.productService.findOne({ id })
        if (!products) {
            throw new BadRequestException("Product not found")
        }

        await this.productService.update(id, body);

        return this.productService.findOne({ id });
    }

    // * Update Product Images.
    @UseGuards(AuthGuard)
    @Put('admin/product-images/:id')
    async updateImages(
        @Param('id') id: string,
        @Body() body: ProductImagesUpdateDTO
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const product = await this.productService.findOne({ id })
        if (!product) {
            throw new BadRequestException("Product not found")
        }

        for (let i of body.images) {
            const productImages = new ProductImages()
            productImages.productId = id
            productImages.image = i
            await this.productImageService.create(productImages)
        }

        return this.productImageService.find({ productId: id });
    }

    // * Delete product and the multiple images
    @UseGuards(AuthGuard)
    @Delete('admin/product/:id')
    async delete(@Param('id') id: string) {
        // * Find the related images
        const findImages = await this.productImageService.find({ productId: id });

        // * Delete the related images
        for (const image of findImages) {
            await this.productImageService.delete(image.productId);
        }

        // * Delete the product
        return this.productService.delete(id);
    }

    // * Delete Product Images
    @UseGuards(AuthGuard)
    @Delete('admin/product-images/:id')
    async deleteImages(@Param('id') id: string) {
        return this.productImageService.delete(id);
    }

}
