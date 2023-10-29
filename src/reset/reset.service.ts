import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Reset } from './models/reset.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResetService extends AbstractService{
    constructor(
        @InjectRepository(Reset) private readonly resetRepository: Repository<Reset>
    ) {
        super(resetRepository)
    }

    async findByTokenExpiresAt(token: string): Promise<Reset | null> {
        const reset = await this.resetRepository.findOne({ where: { token } });

        if (!reset || reset.expiresAt < Date.now()) {
            return null; // Token is invalid or expired
        }

        return reset;
    }
}
