import { Product } from "src/product/models/product.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({default: 'false'})
    completed: boolean;

    @Column({name: "product_id"})
    product_id: string;

    @Column({name: "user_id"})
    user_id: string;

    @ManyToOne(() => Product, (product) => product.cart)
    @JoinColumn({name: "product_id"})
    product: Product;

    @ManyToOne(() => User, (user) => user.cart)
    @JoinColumn({name: "user_id"})
    user: User;
}