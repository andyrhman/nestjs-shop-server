import { ArrayNotEmpty, ArrayMinSize, IsString } from "class-validator";

export class ProductUpdateDto {
    title: string;

    description: string;

    image: string;

    @ArrayNotEmpty({ message: 'Images is required' })
    @ArrayMinSize(1, { message: 'Images should have at least 1 item' })
    @IsString({each: true, message: 'Images must be a string'})
    images: string[]

    price: number
}
