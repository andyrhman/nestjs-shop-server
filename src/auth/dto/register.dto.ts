import { IsNotEmpty, IsEmail, Length } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: 'Name is required' })
    fullName: string;

    @IsNotEmpty({ message: 'Username is required' })
    username: string;

    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, undefined, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    confirm_password: string;
}