import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Address } from './models/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService extends AbstractService{
    constructor(
        @InjectRepository(Address) private readonly addressRepository: Repository<Address>
    ) {
        super(addressRepository)
    }
}
