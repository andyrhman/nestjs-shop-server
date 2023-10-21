import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    ConflictException,
    Controller,
    Get,
    Post,
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

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) { }

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

        return this.userService.create({
            ...data,
            username: body.username.toLowerCase(),
            email: body.email.toLowerCase(),
            password: hashPassword
        });
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
            user = await this.userService.findByEmail(email);
        } else {
            user = await this.userService.findByUsername(username);
        }

        // If user doesn't exist, throw a BadRequestException indicating invalid credentials.
        if (!user) {
            throw new BadRequestException('Username or Email is Invalid');
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
}
