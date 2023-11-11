import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { TokenListener } from './listener/auth.listener';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    CommonModule,
    UserModule,
    MailerModule.forRoot({
      transport:{
        host: '0.0.0.0',
        port: 1025,
      },
      defaults: {
        from: 'service@mail.com'
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false
        }
      }
    }),
  ],
  providers: [AuthService, TokenListener],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
