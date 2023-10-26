import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Cart } from "src/cart/models/cart.entity";
import { OrderItem } from "src/order/models/order-item.entity";

@Entity('product_variations')
export class ProductVariation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({name: "product_id"})
    product_id: string;

    @ManyToOne(() => Product, (product) => product.variant)
    @JoinColumn({name: "product_id"})
    product: Product;

    @OneToMany(() => Cart, (cart) => cart.variant)
    cart: Cart[];

    @OneToMany(() => OrderItem, (order_item) => order_item.variant)
    order_item: OrderItem[];
}