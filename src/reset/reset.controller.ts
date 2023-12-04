import { BadRequestException, NotFoundException, Controller, Post, Body, Put } from '@nestjs/common';
import { ResetService } from './reset.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { ResetDTO } from './dto/reset.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class ResetController {

    private readonly TOKEN_EXPIRATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    constructor(
        private resetService: ResetService,
        private mailerService: MailerService,
        private userService: UserService,
        private configService: ConfigService
    ) { }

    @Post('forgot')
    async forgot(
        @Body('email') email: string
    ) {
        if (!email) {
            throw new BadRequestException("Email must be provided")
        }
        const resetToken = crypto.randomBytes(16).toString('hex');
        const tokenExpiresAt = Date.now() + this.TOKEN_EXPIRATION;
        const checkEmail = await this.userService.findOne({email});
        if (!checkEmail) {
            throw new NotFoundException('Email not found!');
        }
        // Save the reset token and expiration time
        await this.resetService.create({ 
            token: resetToken, 
            email,
            expiresAt: tokenExpiresAt,
            used: false, // Token is not used yet
        })

        const url = `${this.configService.get('ORIGIN_2')}/reset/${resetToken}`;

        await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Your Password',
            template: '/var/nest-shop-server/src/reset/templates/email',
            context: {
                url: url, // Pass the token to the template
            },
        })

        return {
            message: "Success! Please check your email.",
        }
    }

    @Post('reset')
    async reset(
        @Body() body: ResetDTO
    ) {
        if (body.password !== body.confirm_password) {
            throw new BadRequestException("Password do not match.");
        }

        const resetToken = await this.resetService.findByTokenExpiresAt(body.token);
        if (!resetToken) {
            throw new NotFoundException('Token is Invalid or Expired');
        }

        if (resetToken.used) {
            throw new BadRequestException('Token has already been used');
        }

        const user = await this.userService.findOne({email: resetToken.email});
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.email !== resetToken.email) {
            throw new NotFoundException('Invalid token or email');
        }

        await this.userService.update(user.id, {
            password: await argon2.hash(body.password),
        });
        await this.resetService.update(resetToken.id, {
            used: true       
        });

        return { message: 'Password reset successful' };
    }
}