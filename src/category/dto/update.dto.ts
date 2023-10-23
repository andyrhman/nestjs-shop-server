import { IsNotEmpty } from "class-validator";

export class UpdateCategoryDTO {
    @IsNotEmpty()
    name?: string
} 