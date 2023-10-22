export class CreateOrderDto {
    products: {
        product_id: string;
        quantity: number;
    }[]
}