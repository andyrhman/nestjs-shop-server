import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDTO } from './dto/create.dto';
import { Cart } from './models/cart.entity';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCartDto } from './dto/update.dto';

@Controller()
export class CartController {
    constructor(
        private cartService: CartService,
        private authService: AuthService
    ) { }

    // * Get all user carts
    @UseGuards(AuthGuard)
    @Get('admin/carts')
    async getCarts(
        @Req() request: Request
    ) {
        let carts = await this.cartService.find({}, ['user']);

        if (request.query.search) {

            const search = request.query.search.toString().toLowerCase();

            carts = carts.filter(cart => {
                const userMatches = cart.user && (
                    cart.user.fullName.toLowerCase().includes(search) ||
                    cart.user.username.toLowerCase().includes(search) ||
                    cart.user.email.toLowerCase().includes(search)
                );

                const productMatches = cart.product_title.toLowerCase().includes(search);

                return productMatches || userMatches;
            });
        }
        if (request.query.sortByCompleted || request.query.sortByDate) {
            const sortByCompleted = request.query.sortByCompleted?.toString().toLowerCase();
            const sortByDate = request.query.sortByDate?.toString().toLowerCase();
        
            carts.sort((a, b) => {
                if (sortByCompleted) {
                    if (sortByCompleted === 'asc') {
                        if (a.completed !== b.completed) {
                            return a.completed ? 1 : -1;
                        }
                    } else {
                        if (a.completed !== b.completed) {
                            return a.completed ? -1 : 1;
                        }
                    }
                }
        
                if (sortByDate) {
                    if (sortByDate === 'newest') {
                        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                    } else {
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    }
                }
        
                return 0;
            });
        }
        
        return carts;
    }

    // * Add products to cart
    // ? Added variant code solution -> https://www.phind.com/search?cache=v3lv10sq5h4rnfsiiz6iruv1
    @Post('cart')
    async create(
        @Body() body: CreateCartDTO,
        @Req() request: Request
    ) {
        const user = await this.authService.userId(request);
        const existingCartItem = await this.cartService.findCartItemByProductAndVariant(body.product_id, body.variant_id, user);
    
        if (existingCartItem) {
            existingCartItem.quantity += body.quantity;
            return this.cartService.update(existingCartItem.id, existingCartItem);
        } else {
            const c = new Cart();
            c.product_title = body.product_title;
            c.quantity = body.quantity;
            c.price = body.price;
            c.product_id = body.product_id;
            c.variant_id = body.variant_id;
            c.user_id = user
    
            return this.cartService.create(c);
        }
    }

    // * Get authenticated user products cart
    @Get('cart')
    async get(
        @Req() request: Request
    ) {
        const user = await this.authService.userId(request);
        const cart = await this.cartService.findUserCart({ user_id: user }, ['order', 'variant']);
        if (!cart) {
            throw new NotFoundException()
        }
        return cart;
    }

    // * Update quantity
    @Put('cart/:id')
    async update(
        @Param('id') id: string,
        @Body() body: UpdateCartDto
    ){
        return this.cartService.update(id, body)
    }

    // * Delete Cart
    @Delete('cart/:cart_id')
    async delete(
        @Param('cart_id') cart_id: string,
        @Req() request: Request
    ) {
        const user_id = await this.authService.userId(request);
        const cart = await this.cartService.findOne({ id: cart_id });

        if (cart.user_id !== user_id) {
            throw new ForbiddenException();
        }
        return this.cartService.deleteUserCart(user_id, cart_id);
    }
}
