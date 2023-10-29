import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Order } from './models/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService extends AbstractService{
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ) {
        super(orderRepository)
    }
    async findCompletedOrdersByUser(userId: string) {
        return this.repository.find({ where: { user_id: userId, completed: true } });
    }
    async chart(): Promise<any[]> {
        const query = `
            SELECT
            TO_CHAR(o.created_at, 'YYYY-MM-DD') as date,
            REPLACE(TO_CHAR(TRUNC(sum(i.price * i.quantity)), 'FM999G999G999'), ',', '') as sum
            FROM orders o
            JOIN order_items i on o.id = i.order_id
            WHERE o.completed = true
            GROUP BY TO_CHAR(o.created_at, 'YYYY-MM-DD')
            ORDER BY TO_CHAR(o.created_at, 'YYYY-MM-DD') ASC;      
        `;
    
        const result = await this.orderRepository.query(query);
        return result;
    }    
}
