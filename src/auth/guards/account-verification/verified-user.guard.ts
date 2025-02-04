// src/auth/guards/verified-user.guard.ts
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
import { UserService } from 'src/users/providers/user.service';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (authTypes?.includes(AuthType.None)) {
      return true;
    }

    if (authTypes?.includes(AuthType.Bearer)) {
      const request = context.switchToHttp().getRequest<AuthRequest>();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated!');
      }

      const dbUser = await this.userService.findById({ id: user.id });
      if (!dbUser.verified) {
        console.log('User not verified:', dbUser);
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account.',
        );
      }
    }

    return true;
  }
}
