import { Injectable } from "@nestjs/common";
import { Order } from "../models/order.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { MailerService } from "@nestjs-modules/mailer";
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

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

        const templatePath = path.join(__dirname, '..', '..', '..', 'common', 'mail', 'templates', 'order.hbs');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);

        const html = template({
            products,
            orderId,
            orderTotal
          });
    
        await this.mailerService.sendMail({
            to: 'andyrhmnn@gmail.com',
            subject: 'An order has been completed',
            html: html,
        })
    }    
}