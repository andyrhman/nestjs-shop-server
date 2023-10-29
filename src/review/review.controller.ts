import { AuthService } from './../auth/auth.service';
import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { CreateReviewDTO } from './dto/create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderItemService } from 'src/order/order-item.service';
import { OrderService } from 'src/order/order.service';
import { ProductService } from 'src/product/product.service';

@Controller()
export class ReviewController {
    constructor(
        private reviewService: ReviewService,
        private authService: AuthService,
        private orderItemService: OrderItemService,
        private orderService: OrderService,
        private productService: ProductService
    ) {}

    @UseGuards(AuthGuard)
    @Get('admin/review')
    async get(){
        return this.reviewService.find({})
    }

    // * Create user review.
    // ? https://www.phind.com/search?cache=jzhjmit5z3nnh9ky1xhmu369
    @Post('review')
    async create(
        @Body() body: CreateReviewDTO,
        @Req() request: Request
    ){
        const user = await this.authService.userId(request);
        const reviewExist = await this.reviewService.findOne({user_id: user});
        const product = await this.productService.findOne({id: body.product_id});
        if (reviewExist) {
            throw new BadRequestException("You have already review this product.")
        }
        if (body.star > 5) {
            throw new BadRequestException()
        }
        if (!product) {
            throw new BadRequestException("Product does not exist.")
        }
        const completedOrders = await this.orderService.findCompletedOrdersByUser(user);
        const productInOrderItems = await this.orderItemService.isProductInOrderItems(body.product_id, completedOrders);
        if (!productInOrderItems) {
            throw new BadRequestException("You can't review a product that you haven't purchased.")
        }
        const review = await this.reviewService.create({
            ...body,
            user_id: user
        });
        return review;
    }
}
