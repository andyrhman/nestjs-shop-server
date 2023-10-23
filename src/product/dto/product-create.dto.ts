import { IsNotEmpty, ArrayNotEmpty, ArrayMinSize, IsString } from "class-validator";

export class ProductCreateDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    image: string;

    @ArrayNotEmpty({ message: 'Images is required' })
    @ArrayMinSize(1, { message: 'Images should have at least 1 item' })
    @IsString({each: true, message: 'Images must be a string'})
    images: string[]

    @IsNotEmpty()
    price: number

    @ArrayNotEmpty({ message: 'Variant is required' })
    @ArrayMinSize(1, { message: 'Variant should have at least 1 item' })
    @IsString({each: true, message: 'Variant must be a string'})
    variants: string[]
}
