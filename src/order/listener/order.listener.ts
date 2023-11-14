import { Injectable } from "@nestjs/common";
import { Order } from "../models/order.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class OrderListener{
    constructor(
        private mailerService: MailerService
    ) {}

    @OnEvent('order.completed')
    async handleOrderCompletedEvent(order: Order) {
        const orderId = order.id;
        const orderTotal = `Rp${new Intl.NumberFormat('id-ID').format(order.total)}`;
        const products = order.order_items.map(item => ({
            title: item.product_title,
            variant: item.variant.name,
            price: `Rp${new Intl.NumberFormat('id-ID').format(item.price)}`,
            quantity: item.quantity,
            image: item.product.image
        }));
    
        await this.mailerService.sendMail({
            to: 'andyrhmnn@gmail.com',
            subject: 'An order has been completed',
            // ! https://www.phind.com/search?cache=terb3h9bevwjuxmdfjy9gioq
            template: '/var/nest-shop-server/src/order/templates/order',
            context: {
                products,
                orderId,
                orderTotal
            },
        })
    }    
}