import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Req, UseFilters } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO } from './dto/create.dto';
import { Cart } from './models/cart.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/http.exception';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService,
        private authService: AuthService
    ) {}

    // * Add products to cart
    // TODO -> If the cart is completed don't increment the quantity
    // TODO -> Fix it by creating another cart.
    @Post()
    async create(
        @Body() body: CreateCartDTO,
        @Req() request: Request
    ){
        const user = await this.authService.userId(request);
        const existingProduct = await this.cartService.findLatestUncompletedProduct(body.product_id, user);
        
        if (existingProduct) {
            if (existingProduct.completed === true) {
                const c = new Cart();
                c.product_title = body.product_title;
                c.quantity = body.quantity;
                c.price = body.price;
                c.product_id = body.product_id;
                c.user_id = user
    
                return this.cartService.create(c);
            } else {
                existingProduct.quantity += body.quantity;
                return this.cartService.update(existingProduct.id, existingProduct);
            }
        } else {
            const c = new Cart();
            c.product_title = body.product_title;
            c.quantity = body.quantity;
            c.price = body.price;
            c.product_id = body.product_id;
            c.user_id = user
    
            return this.cartService.create(c);
        }
    }
    
    

    // * Get authenticated user products cart
    @Get()
    async get(
        @Req() request: Request
    ){
        const user = await this.authService.userId(request);
        const cart = await this.cartService.find({user_id: user}, ['order']);
        if (!cart) {
            throw new NotFoundException()
        }
        return cart;
    }

    // * Delete Cart
    @Delete(':cart_id')
    async delete(
        @Param('cart_id') cart_id: string,
        @Req() request: Request
    ){
        const user_id = await this.authService.userId(request);
        const cart = await this.cartService.findOne({id: cart_id});

        if(cart.user_id !== user_id){
            throw new ForbiddenException();
        }
        return this.cartService.deleteUserCart(user_id, cart_id);
    }
}
