import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { ProductService } from "src/product/product.service";
import { randomInt } from "crypto";
import { UserService } from "src/user/user.service";
import { OrderService } from "src/order/order.service";
import { CartService } from "src/cart/cart.service";

const bootstrap = async () => {
    const app = await NestFactory.createApplicationContext(AppModule);

    const cartService = app.get(CartService);
    const productService = app.get(ProductService);
    const userService = app.get(UserService);
    const orderService = app.get(OrderService);
    const users = await userService.find({});
    const product = await productService.find({});
    const orders = await orderService.find({})

    for (let i = 0; i < 30; i++) {
        await cartService.create({
            product_title: product[i].title,
            quantity: randomInt(1,4),
            product_id: product[i].id,
            user_id: users[i].id,
            order_id: orders[i].id,
            price: product[i].price,
            completed: true
        });
    }

    process.exit()
}
bootstrap();