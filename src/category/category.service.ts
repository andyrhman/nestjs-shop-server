import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Category } from './models/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService extends AbstractService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
    ) {
        super(categoryRepository)
    }
}