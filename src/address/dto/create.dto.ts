import { IsNotEmpty } from "class-validator";

export class AddressCreateDto {
    @IsNotEmpty({ message: 'Street is required' })
    street: string;

    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @IsNotEmpty({ message: 'Province is required' })
    province: string;

    @IsNotEmpty({ message: 'Zip is required' })
    zip: string;

    @IsNotEmpty({ message: 'Country is required' })
    country: string;

    @IsNotEmpty({ message: 'Phone number is required' })
    phone: string;
}