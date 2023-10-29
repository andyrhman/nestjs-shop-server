import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateReviewDTO{
    @IsNotEmpty()
    star: number;

    @IsNotEmpty()
    comment: string;

    @IsNotEmpty()
    @IsUUID()
    product_id: string;

    image: string;
}