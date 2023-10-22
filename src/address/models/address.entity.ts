import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  province: string;

  @Column()
  zip: string;

  @Column()
  country: string;

  @Column()
  phone: string;

  @Column({ name: 'user_id' })  // Explicit column for the foreign key
  user_id: string;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id' })
  user: User;
}