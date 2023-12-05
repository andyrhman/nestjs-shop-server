import { Injectable } from "@nestjs/common";
import { User } from "src/user/models/user.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { MailerService } from "@nestjs-modules/mailer";
import * as crypto from 'crypto';
import { TokenService } from "src/user/token.service";
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class TokenListener{
    private readonly TOKEN_EXPIRATION = 1 * 60 * 1000;
    constructor(
        private mailerService: MailerService,
        private tokenService: TokenService,
        private configService: ConfigService
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

        const url = `${this.configService.get('ORIGIN_2')}/api/verify/${token}`;

        const name = user.fullName
    
        // ? https://www.phind.com/agent?cache=clpqjretb0003ia07g9pc4v5a
        const templatePath = path.join(__dirname, '..', '..', '..', 'common', 'mail', 'templates', 'auth.hbs');
        const templateString = fs.readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(templateString);
        
        const html = template({
          name,
          url
        });
        
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Verify your email',
          html: html,
        });
    }    
}