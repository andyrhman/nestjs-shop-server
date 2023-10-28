import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    ConflictException,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TokenService } from 'src/user/token.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
    private readonly TOKEN_EXPIRATION = 30 * 60 * 1000;
    constructor(
        private userService: UserService,
        private tokenService: TokenService,
        private jwtService: JwtService,
        private authService: AuthService,
        private eventEmiter: EventEmitter2,
        private mailerService: MailerService,
    ) { }

    // * Resend verify token
    @Post('verify')
    async resend(
        @Body('email') email: string
    ){ 
        if (!email) {
            throw new BadRequestException("Provide your email address")
        }

        const user = await this.userService.findOne({email: email});
        if (!user) {
            throw new BadRequestException("Email not found")
        }
        if (user.is_verified) {
            throw new NotFoundException('Your account had already verified');
        }
        const token = crypto.randomBytes(16).toString('hex');
        const tokenExpiresAt = Date.now() + this.TOKEN_EXPIRATION;

        // Save the reset token and expiration time
        await this.tokenService.create({ 
            token, 
            email: user.email,
            user_id: user.id,
            expiresAt: tokenExpiresAt
        })

        const url = `http://localhost:8000/api/verify/${token}`;

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

        return user;
    }

    // * Register user
    @Post('user/register')
    async register(
        @Body() body: RegisterDto
    ) {
        const { confirm_password, ...data } = body;

        if (body.password !== body.confirm_password) {
            throw new BadRequestException("Password do not match.");
        }

        // Check if the username or email already exists
        const existingUser = await this.userService.findByUsernameOrEmail(
            body.username,
            body.email,
        );

        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        // Hash Password
        const hashPassword = await argon2.hash(body.password);

        const user = await this.userService.create({
            ...data,
            username: body.username.toLowerCase(),
            email: body.email.toLowerCase(),
            password: hashPassword
        });

        await this.eventEmiter.emit('user.created', user)
    }

    // * Verify account
    @Put('verify/:token')
    async verify(
        @Param('token') token: string
    ) {
        const userToken = await this.tokenService.findByTokenExpiresAt(token);
        if (!userToken) {
            throw new NotFoundException('Invalid verify ID');
        }

        if (userToken.used) {
            throw new BadRequestException('Verify ID has already been used');
        }

        const user = await this.userService.findOne({ email: userToken.email, id: userToken.user_id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (user.is_verified) {
            throw new NotFoundException('Your account had already verified');
        }

        if (user.email !== userToken.email && user.id !== userToken.user_id) {
            throw new BadRequestException('Invalid Verify ID or email');
        }

        await this.tokenService.update(userToken.id, { used: true });
        await this.userService.update(user.id, { is_verified: true })

        return { message: 'Account verified successfully' };
    }

    // * Login User
    @Post(['admin/login', 'user/login'])
    async login(
        @Body('username') username: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request,
        @Body('rememberMe') rememberMe?: boolean,
    ) {
        let user;

        // Check whether to find the user by email or username based on input.
        if (email) {
            user = await this.userService.findOne({ email: email });
        } else {
            user = await this.userService.findOne({ username: username });
        }

        // If user doesn't exist, throw a BadRequestException indicating invalid credentials.
        if (!user) {
            throw new BadRequestException('Username or Email is Invalid');
        }
        if (user.is_verified === false) {
            throw new BadRequestException('Please verfiy your email first, before log in.');
        }

        if (!await argon2.verify(user.password, password)) {
            throw new BadRequestException("Password is invalid")
        }

        // Calculate the expiration time for the refresh token
        // Generate a refresh token using the JWT service with the calculated expiration time.
        const refreshTokenExpiration = rememberMe
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Adding 7 days in milliseconds

        // * Check for role
        const adminLogin = request.path === '/api/admin/login';

        if (user.is_user && adminLogin) {
            throw new UnauthorizedException()
        }

        const jwt = await this.jwtService.signAsync({
            id: user.id,
            scope: adminLogin ? 'admin' : 'user'
        });

        response.cookie('my_session', jwt, {
            httpOnly: true,
            expires: refreshTokenExpiration,
        });
        response.status(200);

        return jwt;
    }

    // * Getting the authenticated user.
    @UseGuards(AuthGuard)
    @Get(['admin', 'user'])
    async user(
        @Req() request: Request,
    ) {
        const id = await this.authService.userId(request);

        if (request.path === '/api/admin') {
            return this.userService.findOne({ id });
        }

        const user = await this.userService.findOne({ id });

        // * If user is ambassador
        if (user.is_user === true) {
            return user;
        } else if (user.is_user === false) {
            return user;
        }
    }

    // * Update user info
    @UseGuards(AuthGuard)
    @Put(['admin/info', 'user/info'])
    async update(
        @Req() request: Request,
        @Body() body: any,
    ) {
        const id = await this.authService.userId(request);

        const existingUser = await this.userService.findOne({ id });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        if (body.fullname) {
            existingUser.fullName = body.fullname;
        }

        if (body.email && body.email !== existingUser.email) {
            const existingUserByEmail = await this.userService.findOne({ email: body.email });
            if (existingUserByEmail) {
                throw new ConflictException('Email already exists');
            }
            existingUser.email = body.email;
        }

        if (body.username && body.username !== existingUser.username) {
            const existingUserByUsername = await this.userService.findOne({ username: body.username });
            if (existingUserByUsername) {
                throw new ConflictException('Username already exists');
            }
            existingUser.username = body.username;
        }

        await this.userService.update(id, existingUser);

        return this.userService.findOne({ id });
    }

    // * User update their own password
    @Put(['admin/password', 'user/password'])
    @UseGuards(AuthGuard)
    async updatePassword(
        @Req() request: Request,
        @Body() body: any,
    ) {
        if (!body.password || !body.confirm_password) {
            throw new BadRequestException();
        }

        if (body.password !== body.confirm_password) {
            throw new BadRequestException("Password do not match.");
        }

        const cookie = request.cookies['my_session'];

        const { id } = await this.jwtService.verifyAsync(cookie);

        const hashPassword = await argon2.hash(body.password);

        await this.userService.update(id, {
            password: hashPassword
        });

        return this.userService.findOne({ id });
    }

    // * Logout user
    @UseGuards(AuthGuard)
    @Post(['admin/logout', 'user/logout'])
    async logout(
        @Res({ passthrough: true }) response: Response
    ) {
        response.clearCookie('my_session');

        return {
            message: "success"
        }
    }
}
