import { User } from './user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn  } from 'typeorm';

@Entity('user_token')
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column()
    user_id: string;

    @Column({
        unique: true,
    })
    token: string;

    @Column({ type: 'bigint' }) // Store timestamp as bigint
    expiresAt: number; // Store the expiration timestamp in milliseconds

    @Column({ default: false }) // Default to false, indicating token is not used
    used: boolean;

    @ManyToOne(() => User, (user) => user.verify)
    @JoinColumn({name: "user_id"})
    user: User;

}