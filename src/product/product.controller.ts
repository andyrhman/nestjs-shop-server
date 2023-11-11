import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { Product } from './models/product.entity';
import slugify from 'slugify';
import { ProductImagesService } from './product-images.service';
import { ProductImages } from './models/product.images';
import { AuthGuard } from 'src/auth/auth.guard';
import { ProductUpdateDto } from './dto/product-update.dto';
import { isUUID } from 'class-validator';
import { ProductImagesUpdateDTO } from './dto/update-images.dto';
import { Request } from 'express';
import { ProductVariation } from './models/product-variation.entity';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantsUpdateDTO } from './dto/update-variants.dto';

@Controller()
export class ProductController {
    constructor(
        private productService: ProductService,
        private productImageService: ProductImagesService,
        private productVariantService: ProductVariantService
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
        p.category_id = body.category

        const product = await this.productService.create(p);
        for (let i of body.images) {
            const productImages = new ProductImages()
            productImages.productId = product.id
            productImages.image = i
            await this.productImageService.create(productImages)
        }

        for (let v of body.variants) {
            const productVariant = new ProductVariation()
            productVariant.name = v
            productVariant.product_id = product.id
            await this.productVariantService.create(productVariant)
        }

        return product;
    }

    // * Get all products
    // ? ✅ https://www.phind.com/search?cache=hjf92lz8rap43f6fyk0ludro
    // ! ❌ https://www.phind.com/search?cache=uambrl956nwdhj9g2clkh4h8
    @Get('products')
    async all(
        @Req() request: Request
    ) {
        let products = await this.productService.find({}, ['variant', 'category']);

        if (request.query.search) {
            const search = request.query.search.toString().toLowerCase();
            products = products.filter(
                p => p.title.toLowerCase().indexOf(search) >= 0 ||
                    p.description.toLowerCase().indexOf(search) >= 0
            )
        }
        if (request.query.filterByVariant) {
            const filterByVariant = request.query.filterByVariant.toString().toLowerCase().split(',');
            products = products.filter(
                p => p.variant.some(v => filterByVariant.includes(v.name.toLowerCase()))
            )
        }
        if (request.query.filterByCategory) {
            const filterByCategory = request.query.filterByCategory.toString().toLowerCase().split(',');
            products = products.filter(
                p => filterByCategory.includes(p.category.name.toLowerCase())
            )
        }
        if (request.query.sortByPrice || request.query.sortByDate) {
            const sortByPrice = request.query.sortByPrice?.toString().toLowerCase();
            const sortByDate = request.query.sortByDate?.toString().toLowerCase();

            products.sort((a, b) => {
                if (sortByPrice) {
                    if (sortByPrice === 'asc') {
                        return b.price - a.price;
                    } else {
                        return a.price - b.price;
                    }
                }

                if (sortByDate) {
                    if (sortByDate === 'newest') {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    } else {
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    }
                }

                return 0;
            });
        }
        return products;
    }

    // * Get all variants
    @Get('variants')
    async variants(){
        return this.productVariantService.find({})
    }

    // * Get one product
    @Get('product/:slug')
    async get(@Param('slug') slug: string) {
        return this.productService.findOne({ slug }, ['product_images', 'variant', 'category', 'review', 'review.user']);
    }

    // * Get one product
    @UseGuards(AuthGuard)
    @Get('admin/product/:id')
    async getADmin(@Param('id') id: string) {
        return this.productService.findOne({ id }, ['product_images', 'variant', 'category']);
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

    // * Update Product Variants.
    @UseGuards(AuthGuard)
    @Put('admin/product-variants/:id')
    async updateVariants(
        @Param('id') id: string,
        @Body() body: ProductVariantsUpdateDTO
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        const product = await this.productService.findOne({ id })
        if (!product) {
            throw new BadRequestException("Product not found")
        }

        for (let v of body.variants) {
            const productVariant = new ProductVariation()
            productVariant.name = v
            productVariant.product_id = product.id
            await this.productVariantService.create(productVariant)
        }

        return this.productVariantService.find({ product_id: id });
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

        // * Delete the multiple images
        for (const image of findImages) {
            await this.productImageService.deleteMultipleImages(image.productId);
        }

        // * Delete the related variants
        for (const variant of findImages) {
            await this.productVariantService.deleteMultipleVariants(variant.productId);
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

    // * Delete Product Variant
    @UseGuards(AuthGuard)
    @Delete('admin/product-variants/:id')
    async deleteVariants(@Param('id') id: string) {
        return this.productVariantService.delete(id);
    }
}
