import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
    constructor(
        private userService: UserService
    ) {}

    @Get('admin/users')
    async get(
        @Req() request: Request
    ){
        let user = await this.userService.find({})
        if (request.query.search) {
            const search = request.query.search.toString().toLowerCase();
            user = user.filter(
                p => p.fullName.toLowerCase().indexOf(search) >= 0 ||
                    p.username.toLowerCase().indexOf(search) >= 0
            )
        }

        return user;
    }

    @Get('admin/total-users')
    async totalUsers(){
        return this.userService.total({})
    }
}
