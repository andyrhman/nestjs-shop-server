import { BadRequestException, Body, Controller, NotFoundException, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './models/order.entity';
import { CreateOrderDto } from './dto/create.dto';
import { OrderItem } from './models/order-item.entity';
import { Cart } from 'src/cart/models/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { DataSource } from 'typeorm';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private authService: AuthService,
        private userService: UserService,
        private dataSource: DataSource,
        private cartService: CartService
    ) { }

    @Post('checkout/orders')
    async create(
        @Req() request: Request,
        @Body() body: CreateOrderDto
    ) {

        const userId = await this.authService.userId(request);

        const user = await this.userService.findOne({ id: userId });

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const o = new Order()
            o.name = user.fullName
            o.email = user.email
            o.user_id = userId

            const order = await queryRunner.manager.save(o);

            for (let c of body.carts) {
                const cart: Cart[] = await this.cartService.find({ id: c.cart_id, user_id: userId });

                if (cart.length === 0) {
                    throw new NotFoundException("Cart not found");
                }

                const orderItem = new OrderItem();
                orderItem.order = order;
                orderItem.product_title = cart[0].product_title;
                orderItem.price = cart[0].price;
                orderItem.quantity = cart[0].quantity;
                orderItem.product_id = cart[0].product_id

                await queryRunner.manager.save(orderItem);
            }
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            return {
                message: "Your order has been created!"
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException();
        } finally {
            await queryRunner.release();
        }

    }
}
