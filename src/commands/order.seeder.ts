import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { fakerID_ID as faker } from "@faker-js/faker";
import { OrderService } from "src/order/order.service";
import { OrderItemService } from "src/order/order-item.service";
import { randomInt } from "crypto";
import { UserService } from "src/user/user.service";
import { ProductService } from "src/product/product.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const orderService = app.get(OrderService);
    const orderItemService = app.get(OrderItemService);
    const productService = app.get(ProductService)

    // * use this to fetch the user from the db
    const userService = app.get(UserService);

    // * Fetch all users from the database
    const users = await userService.find({});
    const product = await productService.find({})

    for (let i = 0; i < 30; i++) {
        const order = await orderService.create({
            user_id: users[i].id,
            name: users[i].fullName,
            email: users[i].email,
            completed: true
        });

        for (let j = 0; j < randomInt(1, 5); j++) {
            await orderItemService.create({
                order: order,
                product_id: product[i].id,
                product_title: product[i].title,
                price: product[i].price,
                quantity: randomInt(1, 5),
            });
        }
    }

    process.exit()
}
bootstrap();