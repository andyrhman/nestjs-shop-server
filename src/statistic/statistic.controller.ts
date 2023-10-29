import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CartService } from 'src/cart/cart.service';
import { OrderItemService } from 'src/order/order-item.service';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';
import { ReviewService } from 'src/review/review.service';
import { UserService } from 'src/user/user.service';

@Controller()
export class StatisticController {
    constructor(
        private userService: UserService,
        private productService: ProductService,
        private orderService: OrderService,
        private orderItemService: OrderItemService,
        private reviewService: ReviewService,
        private cartService: CartService
    ) { }

    // * Get all total stats
    @Get('admin/stats')
    async stats() {
        const user_total = await this.userService.total({});
        const product_total = await this.productService.total({});
        const order_total = await this.orderService.total({});
        const orderItem_total = await this.orderItemService.total({});
        const review_total = await this.reviewService.total({});
        const cart_total = await this.cartService.total({});

        return {
            user_total: user_total.total,
            product_total: product_total.total,
            order_total: order_total.total,
            orderItem_total: orderItem_total.total,
            review_total: review_total.total,
            cart_total: cart_total.total
        }
    }

    // * Get the order chart stats each day
    @UseGuards(AuthGuard)
    @Get('admin/order-chart')
    async orders() {
        return this.orderService.chart();
    }

    // * Get the product cart chart by the quantity each day
    // ? https://www.phind.com/search?cache=t0nssxrwgnazkph1t3msxli0
    @UseGuards(AuthGuard)
    @Get('admin/cart-chart')
    async carts() {
        return this.cartService.chart();
    }

    // * Get the user registered each day
    // ? https://www.phind.com/search?cache=t0nssxrwgnazkph1t3msxli0
    @UseGuards(AuthGuard)
    @Get('admin/user-chart')
    async users() {
        return this.userService.chart();
    }
}
