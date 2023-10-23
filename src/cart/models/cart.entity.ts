import { Product } from "src/product/models/product.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('carts')
export class Cart{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    product_title: string;

    @Column()
    quantity: number;

    @Column()
    price: number;

    // @ManyToOne(() => Product, (product) => product.cart)
    // product: Product;
}