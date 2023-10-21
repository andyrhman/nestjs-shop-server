import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    async userId(request: Request): Promise<string> {
        const cookie = request.cookies['my_session'];

        if (!cookie) {
            throw new UnauthorizedException('User not authenticated');
        }

        try {
            const data = await this.jwtService.verifyAsync(cookie);
            return data['id'];
        } catch (error) {
            throw new UnauthorizedException('User not authenticated');
        }
    }
}
