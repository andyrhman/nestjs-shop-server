import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('test')
export class Test{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
}