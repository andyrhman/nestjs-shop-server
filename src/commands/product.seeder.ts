import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { fakerID_ID as faker } from "@faker-js/faker";
import { ProductService } from "src/product/product.service";
import { ProductImagesService } from "src/product/product-images.service";
import slugify from "slugify";
import { randomInt } from "crypto";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const productService = app.get(ProductService);
    const productImageService = app.get(ProductImagesService)

    for (let i = 0; i < 30; i++) {
        const title = faker.commerce.productName();
        const slug = slugify(title, {
            lower: true,
            strict: true,
            trim: true
        });
        // * For the product.
        const product = await productService.create({
            title: title,
            slug: slug,
            description: faker.commerce.productDescription(),
            image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'food' }),
            price: faker.commerce.price({ min: 100, max: 1000, dec: 0 })
        });
        // * For the product images
        for (let i = 0; i < randomInt(1, 5); i++) {
            await productImageService.create({
                productId: product.id,
                image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'food' }),
            })
        }
    }

    process.exit()
}
bootstrap();