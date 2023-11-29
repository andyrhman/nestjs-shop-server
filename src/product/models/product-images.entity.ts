import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity('product_images')
export class ProductImages{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "product_id"})
    productId: string;

    @Column()
    image: string;

    @ManyToOne(() => Product)
    @JoinColumn({name: "product_id"})
    product: Product;
}