import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { CommonModule } from 'src/common/common.module';
import { Token } from './models/token.entity';
import { TokenService } from './token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token]),
    CommonModule
  ],
  controllers: [UserController],
  providers: [UserService, TokenService],
  exports: [UserService, TokenService]
})
export class UserModule {}
