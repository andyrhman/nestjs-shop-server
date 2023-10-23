import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

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
}