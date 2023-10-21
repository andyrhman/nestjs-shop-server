import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginatedResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(
        protected readonly repository: Repository<any>
    ) { }

    // Find all user in the DB.
    async all(relations = []): Promise<any[]> {
        return await this.repository.find({ relations });
    }

    async paginate(page = 1, relations = []): Promise<PaginatedResult> {
        const take = 12;

        const [data, total] = await this.repository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations
        });

        return {
            data: data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        }
    }

    async create(data): Promise<any> {
        return this.repository.save(data);
    }

    async update(id: string, data): Promise<any> {
        return this.repository.update(id, data);
    }

    async delete(id: string): Promise<any> {
        return this.repository.delete(id);
    }

    async findOne(options, relations = []) {
        return this.repository.findOne({ where: options, relations });
    }

    async find(options, relations = []) {
        return this.repository.find({ where: options, relations });
    }

    async total(options, relations = []) {
        const entities = await this.repository.find({ where: options, relations });
        return {
            total: entities.length
        };
    }

    // Find a user by their username or email
    async findByUsernameOrEmail(username: string, email: string): Promise<any | null> {
        return this.repository.findOne({
            where: [{ username }, { email }],
        });
    }

    async findByEmail(email: string): Promise<any | null> {
        return this.repository.findOne({ where: { email } }); // Use the 'where' option
    }

    async findByUsername(username: string): Promise<any | null> {
        return this.repository.findOne({ where: { username } }); // Use the 'where' option
    }
}