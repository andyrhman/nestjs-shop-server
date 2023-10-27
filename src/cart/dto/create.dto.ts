import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCartDTO{
    @IsNotEmpty()
    product_title: string;

    @IsNotEmpty()
    @IsInt({each: true, message: 'Quantity must be a number'})
    quantity: number;

    @IsNotEmpty()
    @IsInt({each: true, message: 'Price must be a number'})
    price: number;

    @IsNotEmpty()
    product_id: string;

    @IsNotEmpty()
    variant_id: string;
}