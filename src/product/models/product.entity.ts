import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductImages } from "./product.images";
import { ProductVariation } from "./product-variation.entity";
import { ProductVariantService } from "../product-variant.service";

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

  @OneToMany(() => ProductImages, productImages => productImages.product, { cascade: true })
  product_images: ProductImages[];

  @OneToMany(() => ProductVariation, (variant) => variant.product)
  variant: ProductVariation[];
}