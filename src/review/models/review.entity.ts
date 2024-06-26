import { Order } from "src/order/models/order.entity";
import { Product } from "src/product/models/product.entity";
import { User } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('reviews')
export class Review{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()   
    star: number;
                 
    @Column()
    comment: string;        
 
    @Column()                               
    image: string;

    @Column({name: "user_id"})
    user_id: string;

    @Column({name: "product_id"})
    product_id: string;

    @CreateDateColumn()
    created_at: string;

    @Column({name: "order_id", nullable: true})
    order_id: string;

    @ManyToOne(() => User, (user) => user.review)
    @JoinColumn({name: "user_id"})
    user: User;

    @ManyToOne(() => Product, (product) => product.review)
    @JoinColumn({name: "product_id"})
    product: Product;

    @ManyToOne(() => Order, (order) => order.review)
    @JoinColumn({name: "order_id"})
    order: Order;
}