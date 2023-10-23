import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { fakerID_ID as faker } from "@faker-js/faker";
import { ProductService } from "src/product/product.service";
import { ProductImagesService } from "src/product/product-images.service";
import slugify from "slugify";
import { randomInt } from "crypto";
import { CategoryService } from "src/category/category.service";
import { ProductVariantService } from "src/product/product-variant.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const productService = app.get(ProductService);
    const productImageService = app.get(ProductImagesService);
    const variantService = app.get(ProductVariantService)
    const categoryService = app.get(CategoryService);

    const categories = await categoryService.find({})

    for (let i = 0; i < 30; i++) {
        const title = faker.commerce.productName();
        const slug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        });
        // * For the product
        const product = await productService.create({
            title: title,
            slug: slug,
            description: faker.commerce.productDescription(),
            image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'food' }),
            price: faker.commerce.price({ min: 100, max: 1000, dec: 0 }),
            category_id: categories[i % categories.length].id
        });
        // * For the product images
        for (let i = 0; i < randomInt(1, 5); i++) {
            await productImageService.create({
                productId: product.id,
                image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'food' }),
            })
        }
        // * For the variants
        for (let i = 0; i < randomInt(1, 6); i++) {
            await variantService.create({
                name: faker.commerce.productMaterial(),
                product_id: product.id,
            })
        }
    }

    process.exit()
}
bootstrap();