import { IsNotEmpty, Length } from "class-validator";

export class ResetDTO{
    @IsNotEmpty()
    token: string;

    @IsNotEmpty({ message: 'Password is required' })
    @Length(6, undefined, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    confirm_password: string;
}