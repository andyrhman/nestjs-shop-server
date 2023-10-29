import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Reset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    email: string;

    @Column({
        unique: true,
    })
    token: string;

    @Column({ type: 'bigint' })
    expiresAt: number;

    @Column({ default: false })
    used: boolean
}