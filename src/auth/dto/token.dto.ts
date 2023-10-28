import { IsNotEmpty } from "class-validator";

export class TokenDTO{
    @IsNotEmpty()
    token: string;
}