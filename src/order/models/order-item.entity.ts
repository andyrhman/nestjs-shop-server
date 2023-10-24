import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

export enum OrderItemStatus {
    SedangDikemas = 'Sedang Dikemas',
    Dikirim = 'Dikirim',
    Selesai = 'Selesai',
}

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_title: string;

    @Column()
    price: number;

    @Column()
    quantity: number;

    @Column({
        type: 'enum',
        enum: OrderItemStatus,
        default: OrderItemStatus.SedangDikemas,
    })
    status: OrderItemStatus;

    @Column({name: "product_id"})
    product_id: string;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: 'order_id' })
    order: Order;
}