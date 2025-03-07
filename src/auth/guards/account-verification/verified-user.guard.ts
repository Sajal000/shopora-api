import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { AuthRequest } from 'src/auth/interfaces/auth-request.interfaces';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (authTypes?.includes(AuthType.None)) {
      return true;
    }

    if (authTypes?.includes(AuthType.VerifiedBearer)) {
      const request = context.switchToHttp().getRequest<AuthRequest>();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated!');
      }


      // Check if verified status is in the JWT token payload
      if (user.verified !== true) {
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account.',
        );
      }

      // User is verified based on the token, allow access
      return true;
    }

    return true;
  }
}
