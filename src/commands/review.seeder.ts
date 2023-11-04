import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { fakerID_ID as faker } from "@faker-js/faker";
import { ProductService } from "src/product/product.service";
import { randomInt } from "crypto";
import { UserService } from "src/user/user.service";
import { ReviewService } from "src/review/review.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const reviewService = app.get(ReviewService);
    const productService = app.get(ProductService);
    const userService = app.get(UserService);

    const users = await userService.find({});
    const products = await productService.find({})

    for (let i = 0; i < 100; i++) {
        
        await reviewService.create({
            star: randomInt(1, 5),
            comment: faker.word.words(16),
            image: faker.image.urlLoremFlickr({ width: 200, height: 200, category: 'food' }),
            user_id: users[i % users.length].id,
            product_id: products[i % products.length].id
        });
    }

    process.exit()
}
bootstrap();