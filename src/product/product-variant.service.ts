import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { ProductVariation } from './models/product-variation.entity';

@Injectable()
export class ProductVariantService extends AbstractService {
    constructor(
        @InjectRepository(ProductVariation) private readonly productVariantRepository: Repository<ProductVariation>
    ) {
        super(productVariantRepository)
    }
    async deleteMultipleVariants(product_id: string): Promise<any> {
        return this.productVariantRepository.delete({ product_id });
    }

    async update(product_id: string, data): Promise<any> {
        return this.productVariantRepository.update({id: product_id}, data);
    }
}
