import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { In, Repository } from 'typeorm';
import { OrderItem } from './models/order-item.entity';
import { Order } from './models/order.entity';

@Injectable()
export class OrderItemService extends AbstractService{
    constructor(
        @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>
    ) {
        super(orderItemRepository)
    }

    async isProductInOrderItems(productId: string, orders: Order[]) {
        const orderIds = orders.map(order => order.id);
        const productOrderItems = await this.repository.find({ where: { product_id: productId, order_id: In(orderIds) } });
        return productOrderItems.length > 0;
    }
}
