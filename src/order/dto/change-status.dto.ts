import { IsNotEmpty } from "class-validator";

export class ChangeStatusDTO{
    @IsNotEmpty()
    status: string;
}