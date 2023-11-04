import { AuthService } from './../auth/auth.service';
import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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

    // * Get all reviews
    @UseGuards(AuthGuard)
    @Get('admin/reviews')
    async get(
        @Req() request: Request
    ){
        let reviews =  await this.reviewService.find({}, ['user','product', 'variant'])

        if (request.query.search) {
            const search = request.query.search.toString().toLowerCase();
            reviews = reviews.filter(
                p => p.product.title.toLowerCase().indexOf(search) >= 0 ||
                    p.product.description.toLowerCase().indexOf(search) >= 0
            )
        }
        return reviews;
    }

    // * Get one product reviews
    @UseGuards(AuthGuard)
    @Get('admin/reviews/:id')
    async user(
        @Param('id') id: string
    ){
        return this.reviewService.findOne({id}, ['user', 'variant', 'product'])
    }

    // * Get product reviews.
    @Get('reviews/:id')
    async reviews(
        @Param('id') id: string
    ){
        return this.reviewService.find({product_id: id}, ['variant', 'user'])
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
