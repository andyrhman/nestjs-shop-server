import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Review } from './models/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService extends AbstractService {
    constructor(
        @InjectRepository(Review) private readonly reviewRepository: Repository<Review>
    ) {
        super(reviewRepository)
    }
    async find(options, relations = []) {
        return this.reviewRepository.find({ where: options, relations, order: {created_at: 'DESC'}  });
    }
}
