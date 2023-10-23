import { ArrayMinSize, ArrayNotEmpty, IsString } from "class-validator";

export class ProductImagesUpdateDTO{
    @ArrayNotEmpty({ message: 'Images is required' })
    @ArrayMinSize(1, { message: 'Images should have at least 1 item' })
    @IsString({each: true, message: 'Images must be a string'})
    images?: string[]
}