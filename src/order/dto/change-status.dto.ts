import { IsEnum, IsNotEmpty } from "class-validator";
import { OrderItemStatus } from "../models/order-item.entity";

export class ChangeStatusDTO{
    @IsNotEmpty()
    @IsEnum(OrderItemStatus)
    status: OrderItemStatus;
}