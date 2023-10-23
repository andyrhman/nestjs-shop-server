import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImages } from "./product.images";
import { ProductVariation } from "./product-variation.entity";
import { Category } from "src/category/models/category.entity";
import { Cart } from "src/cart/models/cart.entity";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({name: "category_id"})
  category_id: string;

  @OneToMany(() => ProductImages, productImages => productImages.product, { cascade: true })
  product_images: ProductImages[];

  @OneToMany(() => ProductVariation, (variant) => variant.product)
  variant: ProductVariation[];

  @OneToMany(() => Cart, (cart) => cart.product)
  cart: Cart[];

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({name: "category_id"})
  category: Category;
}