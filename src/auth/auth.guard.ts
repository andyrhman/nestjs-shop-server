import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

//* Check if the user is Authenticated
//? https://www.phind.com/search?cache=f2t08fmne1m0vrnxfzbk8ll7
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      const jwt = request.cookies['my_session'];

      const { scope } = await this.jwtService.verify(jwt);

      const is_user = request.path.toString().indexOf('api/user') >= 0;
      const is_admin = scope === 'admin';
      
      return is_user && (scope === 'user' || is_admin) || !is_user && is_admin;      
    } catch (error) {

      return false;

    }
  }
}