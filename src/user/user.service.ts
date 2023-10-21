import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from './models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends AbstractService{
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super(userRepository)
    }
    async find(options, relations = []) {
        return this.userRepository.find({ where: options, relations, order: {created_at: 'DESC'}  });
    }
}
