import { MigrationInterface, QueryRunner } from "typeorm";

export class SHOPTABLES1701241703621 implements MigrationInterface {
    name = 'SHOPTABLES1701241703621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_title" character varying NOT NULL, "quantity" integer NOT NULL, "price" integer NOT NULL, "variant_id" uuid, "completed" boolean NOT NULL DEFAULT 'false', "product_id" uuid NOT NULL, "user_id" uuid NOT NULL, "order_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_variations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_353249b2d301e047dde9ef0487c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "star" integer NOT NULL, "comment" character varying NOT NULL, "image" character varying NOT NULL, "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "order_id" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "price" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" uuid NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_title" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, "variant_id" uuid, "status" "public"."order_items_status_enum" NOT NULL DEFAULT 'Sedang Dikemas', "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_id" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "completed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "user_id" uuid NOT NULL, "token" character varying NOT NULL, "expiresAt" bigint NOT NULL, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_9b8c6eac80e52d95241b573877f" UNIQUE ("token"), CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "is_user" boolean NOT NULL DEFAULT true, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "city" character varying NOT NULL, "province" character varying NOT NULL, "zip" character varying NOT NULL, "country" character varying NOT NULL, "phone" character varying NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "REL_35cd6c3fafec0bb5d072e24ea2" UNIQUE ("user_id"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" bigint NOT NULL, "used" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_d45463e4ed15395b61eed18bfae" UNIQUE ("token"), CONSTRAINT "PK_5d04f4fd10772663543c6ccc512" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_7d0e145ebd287c1565f15114a18" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_ace88a18b5f57ade458db9061d2" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_52a646a267b076168ee0d7bdfea" FOREIGN KEY ("variant_id") REFERENCES "product_variations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_variations" ADD CONSTRAINT "FK_318ea43851e4dcc507601cc9f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_e4b0ed40bdd0f318108612c2851" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111" FOREIGN KEY ("variant_id") REFERENCES "product_variations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD CONSTRAINT "FK_79ac751931054ef450a2ee47778" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_35cd6c3fafec0bb5d072e24ea20"`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP CONSTRAINT "FK_79ac751931054ef450a2ee47778"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_db2d0ea722e16e0fe8ab3bce111"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_e4b0ed40bdd0f318108612c2851"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf"`);
        await queryRunner.query(`ALTER TABLE "product_variations" DROP CONSTRAINT "FK_318ea43851e4dcc507601cc9f08"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_52a646a267b076168ee0d7bdfea"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_ace88a18b5f57ade458db9061d2"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_7d0e145ebd287c1565f15114a18"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`);
        await queryRunner.query(`DROP TABLE "reset"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_token"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "product_variations"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "product_images"`);
    }

}
