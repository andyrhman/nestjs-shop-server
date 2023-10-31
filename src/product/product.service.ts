import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductImages } from './models/product.images';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService extends AbstractService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>
    ) {
        super(productRepository)
    }
    async find(options, relations = []) {
        return this.productRepository.find({ where: options, relations, order: {created_at: 'DESC'}  });
    }
}
