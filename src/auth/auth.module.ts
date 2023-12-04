import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { TokenListener } from './listener/auth.listener';

@Module({
  imports: [
    CommonModule,
    UserModule
  ],
  providers: [AuthService, TokenListener],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
