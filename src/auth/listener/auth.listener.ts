import { Injectable } from "@nestjs/common";
import { User } from "src/user/models/user.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { MailerService } from "@nestjs-modules/mailer";
import * as crypto from 'crypto';
import { TokenService } from "src/user/token.service";

@Injectable()
export class TokenListener{
    private readonly TOKEN_EXPIRATION = 1 * 60 * 1000;
    constructor(
        private mailerService: MailerService,
        private tokenService: TokenService
    ) {}

    @OnEvent('user.created')
    async handleOrderCompletedEvent(user: User) {
        const token = crypto.randomBytes(16).toString('hex');
        const tokenExpiresAt = Date.now() + this.TOKEN_EXPIRATION;

        // Save the reset token and expiration time
        await this.tokenService.create({ 
            token, 
            email: user.email,
            user_id: user.id,
            expiresAt: tokenExpiresAt
        })

        const url = `http://localhost:4000/api/verify/${token}`;

        const name = user.fullName
    
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verify your email',
            template: '/var/nest-shop-server/src/auth/templates/auth',
            context: {
                name,
                url
            },
        });
    }    
}