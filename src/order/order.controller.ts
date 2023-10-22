import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { Order } from './models/order.entity';
import { CreateOrderDto } from './dto/create.dto';
import { Product } from 'src/product/models/product.entity';
import { OrderItem } from './models/order-item.entity';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private authService: AuthService,
        private userService: UserService,
        private productService: ProductService
    ) {}

    @Post('checkout/orders')
    async create(
        @Req() request: Request,
        @Body() body: CreateOrderDto
    ) {

        const userId = await this.authService.userId(request);

        const user = await this.userService.findOne({ id: userId });

        const o = new Order()
        o.name = user.fullName
        o.email = user.email
        o.user_id = userId

        const order = await this.orderService.create(o)
        
        for (let p of body.products) {
            if (!p.quantity) {
                throw new BadRequestException("Please insert quantity")
            }
            const product: Product = await this.productService.findOne({ id: p.product_id });

            const orderItem = new OrderItem();
            orderItem.order = order.id;
            orderItem.product_title = product.title;
            orderItem.price = product.price;
            orderItem.quantity = p.quantity;
            orderItem.product_id = p.product_id

            await this.orderItemService.create(orderItem);
        }

        return {
            message: "Your order has been created!"
        };
    }
}
