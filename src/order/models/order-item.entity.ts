import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "src/product/models/product.entity";
import { ProductVariation } from "src/product/models/product-variation.entity";

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

    @Column({name: "variant_id", nullable: true})
    variant_id: string;

    @Column({
        type: 'enum',
        enum: OrderItemStatus,
        default: OrderItemStatus.SedangDikemas,
    })
    status: OrderItemStatus;

    @Column({name: "order_id"})
    order_id: string;

    @Column({name: "product_id"})
    product_id: string;

    @ManyToOne(() => Order, order => order.order_items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @ManyToOne(() => Product, product => product.order_item)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariation, (variant) => variant.order_item)
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariation;
}