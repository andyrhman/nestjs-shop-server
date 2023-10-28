import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Token } from './models/token.entity';

@Injectable()
export class TokenService extends AbstractService{
    constructor(
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
    ) {
        super(tokenRepository)
    }
    async findByTokenExpiresAt(token: string){
        const reset = await this.tokenRepository.findOne({ where: { token } });

        if (!reset || reset.expiresAt < Date.now()) {
            return null; // Token is invalid or expired
        }

        return reset;
    }
}
