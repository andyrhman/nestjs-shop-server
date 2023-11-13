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
    // ? https://www.phind.com/search?cache=ttxqttkk5uvdrefvxjufr0uk
    async calculateAverageRating(productId: string): Promise<number> {
        const reviews = await this.reviewRepository.find({ where: { product_id: productId } });
        if (reviews.length === 0) return 0; // If no reviews, return 0

        const totalStars = reviews.reduce((total, review) => total + review.star, 0);
        return totalStars / reviews.length;
    }
    async getRatingAndReviewCount(productId: string): Promise<{ averageRating: number, reviewCount: number }> {
        const reviews = await this.reviewRepository.find({ where: { product_id: productId } });
        let averageRating = 0;
        let reviewCount = reviews.length;

        if (reviewCount > 0) {
            const totalStars = reviews.reduce((total, review) => total + review.star, 0);
            averageRating = totalStars / reviewCount;
        }

        return { averageRating, reviewCount };
    }
}
