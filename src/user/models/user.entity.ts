import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Address } from "src/address/models/address.entity";
import { Order } from "src/order/models/order.entity";
import { Cart } from "src/cart/models/cart.entity";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({default: true})
    is_user: boolean;

    @CreateDateColumn()
    created_at: string;

    @UpdateDateColumn()
    updated_at: string;

    @OneToOne(() => Address, (address) => address.user)
    address: Address;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Cart, (cart) => cart.user)
    cart: Cart[];  
}