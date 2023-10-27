import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Cart } from './models/cart.entity';

@Injectable()
export class CartService extends AbstractService{
    constructor(
        @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>
    ) {
        super(cartRepository)
    }
    
    async deleteUserCart(user_id: string, cart_id: string): Promise<any> {
        return this.repository.delete({user_id: user_id, id: cart_id});
    }

    async findCartItemByProductAndVariant(productId: string, variantId: string, userId: string) {
        return this.cartRepository
            .createQueryBuilder('cart')
            .where('cart.product_id = :productId', { productId })
            .andWhere('cart.variant_id = :variantId', { variantId })
            .andWhere('cart.user_id = :userId', { userId })
            .andWhere('cart.completed = :completed', { completed: false })
            .getOne();
    }

    async find(options, relations = []) {
        const cartItems = await this.cartRepository.find({ where: options, relations });
        // map through the cart items and calculate the total price for each item
        const cartWithTotalPrices = cartItems.map(item => ({
            ...item,
            total: item.price * item.quantity
        }));
        return cartWithTotalPrices;
    }
}
