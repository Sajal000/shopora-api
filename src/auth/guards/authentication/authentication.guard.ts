import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthenticationGuard triggered');

    const authTypes: AuthType[] = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    console.log('Auth Types:', authTypes);

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    if (guards.length === 0) {
      console.log('No guards found. Applying default guard.');
      const defaultGuard =
        this.authTypeGuardMap[AuthenticationGuard.defaultAuthType];
      if (Array.isArray(defaultGuard)) {
        guards.push(...defaultGuard);
      } else {
        guards.push(defaultGuard);
      }
    }

    for (const guard of guards) {
      try {
        const canActivate = await Promise.resolve(guard.canActivate(context));
        if (canActivate) {
          console.log('Guard passed:', guard.constructor.name);
          return true;
        }
      } catch (err) {
        console.error('Guard failed:', guard.constructor.name, err);
      }
    }

    console.log('All guards failed');
    throw new UnauthorizedException();
  }
}
