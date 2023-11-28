import { BadRequestException, Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Order } from './models/order.entity';
import { CreateOrderDto } from './dto/create.dto';
import { OrderItem } from './models/order-item.entity';
import { Cart } from 'src/cart/models/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { DataSource } from 'typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChangeStatusDTO } from './dto/change-status.dto';
import { AddressService } from 'src/address/address.service';
import { isUUID } from 'class-validator';
import { InjectStripeClient } from '@golevelup/nestjs-stripe';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller()
export class OrderController {
    constructor(
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private authService: AuthService,
        private userService: UserService,
        private dataSource: DataSource,
        private cartService: CartService,
        private addressService: AddressService,
        private configService: ConfigService,
        @InjectStripeClient() private readonly stripeClient: Stripe,
        private eventEmiter: EventEmitter2,
    ) { }

    // * Get all orders
    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard)
    @Get('admin/orders')
    async all(
        @Req() request: Request
    ) {
        let orders = await this.orderService.find({}, ['order_items', 'order_items.product'])
        if (request.query.search) {
            const search = request.query.search.toString().toLowerCase();
            orders = orders.filter(order => {
                const orderMatches = order.order_items.some(orderItem => {
                    return orderItem.product_title.toLowerCase().includes(search);
                });
                return (
                    order.name.toLowerCase().includes(search) ||
                    order.email.toLowerCase().includes(search) ||
                    orderMatches
                );
            });
        }
        return orders;
    }

    // * Checkout orders.
    @Post('checkout/orders')
    async create(
        @Req() request: Request,
        @Body() body: CreateOrderDto
    ) {

        const userId = await this.authService.userId(request);

        const user = await this.userService.findOne({ id: userId });
        const address = await this.addressService.findOne({ user_id: userId });
        if (!address) {
            throw new BadRequestException("Please create your shipping address first.")
        }

        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const o = new Order()
            o.name = user.fullName
            o.email = user.email
            o.user_id = userId

            const order = await queryRunner.manager.save(o);

            // * Stripe.
            const line_items = [];

            for (let c of body.carts) {
                if (!isUUID(c.cart_id)) {
                    throw new BadRequestException('Invalid UUID format');
                }
                const cart: Cart[] = await this.cartService.find({ id: c.cart_id, user_id: userId }, ['product', 'variant']);

                if (cart.length === 0) {
                    throw new NotFoundException("Cart not found.");
                }
                if (cart[0].completed === true) {
                    throw new BadRequestException("Invalid order, please add new order.");
                }
                const orderItem = new OrderItem();
                orderItem.order = order;
                orderItem.product_title = cart[0].product_title;
                orderItem.price = cart[0].price;
                orderItem.quantity = cart[0].quantity;
                orderItem.product_id = cart[0].product_id;
                orderItem.variant_id = cart[0].variant_id;

                const totalAmount = cart[0].price * cart[0].quantity;
                if (totalAmount < 7500) {
                    throw new BadRequestException("The total amount must be at least Rp7,500.00");
                }

                cart[0].order_id = order.id;
                await queryRunner.manager.update(Cart, cart[0].id, cart[0]);

                await queryRunner.manager.save(orderItem);

                // * Stripe
                line_items.push({
                    price_data: {
                        currency: 'idr',
                        unit_amount: cart[0].price,
                        product_data: {
                            name: `${cart[0].product_title} - Variant ${cart[0].variant.name}`,
                            description: cart[0].product.description,
                            images: [
                                `${cart[0].product.image}`
                            ]
                        },
                    },
                    quantity: cart[0].quantity
                })
            }
            // * Stripe
            const source = await this.stripeClient.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items,
                success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CHECKOUT_URL}/error`,
            })

            order.transaction_id = source['id'];
            await queryRunner.manager.save(order);

            await queryRunner.commitTransaction();
            return source;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.log(err)
            throw new BadRequestException(err.response);
        } finally {
            await queryRunner.release();
        }
    }

    // * Confirm the orders, change the cart completed to true
    // ? https://www.phind.com/search?cache=ysffjxsftr8fhurcj8u7bx6u
    @Post('checkout/orders/confirm')
    async confirm(
        @Body('source') source: string,
        @Req() request: Request
    ) {
        const user = await this.authService.userId(request)
        const order = await this.orderService.findOne({
            transaction_id: source,
        }, ['user', 'order_items', 'order_items.product', 'order_items.variant']);
        if (!order) {
            throw new NotFoundException("Order not found")
        }
        const carts: Cart[] = await this.cartService.find({ order_id: order.id, user_id: user });
        if (carts.length === 0) {
            throw new ForbiddenException()
        }
        for (let cart of carts) {
            await this.cartService.update(cart.id, { completed: true });
        }
        await this.orderService.update(order.id, { completed: true })
        await this.eventEmiter.emit('order.completed', order);
        return {
            message: 'success'
        }
    }

    // * Get order item from user id
    @Get('/order-user')
    async getUserOrder(
        @Req() request: Request
    ) {
        const id = await this.authService.userId(request);

        return this.orderService.find({ user_id: id }, ['order_items', 'order_items.product']);
    }

    // * Get one order.
    @UseGuards(AuthGuard)
    @Get('admin/order-items/:id')
    async getOrderItem(
        @Param('id') id: string
    ) {
        return this.orderItemService.findOne({ id })
    }

    // * Change order status
    @UseGuards(AuthGuard)
    @Put('admin/orders/:id')
    async status(
        @Param('id') id: string,
        @Body() body: ChangeStatusDTO
    ) {
        if (!isUUID(id)) {
            throw new BadRequestException('Invalid UUID format');
        }
        return this.orderItemService.update(id, body)
    }
}
