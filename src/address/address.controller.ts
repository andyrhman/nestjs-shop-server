import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AddressService } from './address.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { AddressCreateDto } from './dto/create.dto';
import { AddressUpdateDto } from './dto/update.dto';


@Controller()
export class AddressController {
    constructor(
        private addressService: AddressService,
        private authService: AuthService
    ) { }

    // * Get all address
    @UseGuards(AuthGuard)
    @Get('admin/address')
    async all() {
        return this.addressService.find({}, ['user']);
    }

    // * Create Address
    @Post('address')
    async create(
        @Req() request: Request,
        @Body() body: AddressCreateDto
    ) {
        const authUser = await this.authService.userId(request);
        const existingAddress = await this.addressService.findOne({ user_id: authUser })

        if (existingAddress) {
            throw new BadRequestException('Address already exists');
        }

        await this.addressService.create({
            ...body,
            user_id: authUser
        });

        return {
            message: "Address created successfully"
        };
    }

    // * Get authenticated user address
    @Get('address')
    async get(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        const checkAddress = await this.addressService.findOne({ user_id: id });

        if (!checkAddress) {
            throw new NotFoundException('Address not found');
        }

        return this.addressService.findOne({ user_id: id });
    }

    // * Update Address
    @Put('address')
    async update(
        @Body() body: AddressUpdateDto,
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        const checkAddress = await this.addressService.findOne({ user_id: id });

        if (!checkAddress) {
            throw new NotFoundException('Address not found');
        }

        await this.addressService.update(checkAddress, body);

        return {
            message: "Updated Successfully!"
        };
    }

    // * Delete Address
    @Delete('address')
    async delete(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        const checkAddress = await this.addressService.findOne({ user_id: id });

        if (!checkAddress) {
            throw new NotFoundException('Address not found');
        }

        await this.addressService.delete(checkAddress);

        return {
            message: "Address is deleted successfully"
        }
    }
}
