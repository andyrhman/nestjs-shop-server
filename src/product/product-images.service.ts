import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductImages } from './models/product.images';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImagesService extends AbstractService {
    constructor(
        @InjectRepository(ProductImages) private readonly productImagesRepository: Repository<ProductImages>
    ) {
        super(productImagesRepository)
    }
    async delete(productId: string): Promise<any> {
        return this.productImagesRepository.delete({ productId });
    }
}
