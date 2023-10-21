import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '1y' },
        }),
    ],
    providers: [],
    exports: [JwtModule]
})
export class CommonModule { }