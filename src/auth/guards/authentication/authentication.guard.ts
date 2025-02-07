import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { VerifiedUserGuard } from '../account-verification/verified-user.guard';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly verifiedUserGuard: VerifiedUserGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.VerifiedBearer]: [
        this.accessTokenGuard,
        this.verifiedUserGuard,
      ],
      [AuthType.None]: { canActivate: () => true },
    };
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes: AuthType[] = this.reflector.getAllAndOverride(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    for (const guard of guards) {
      try {
        const canActivate = await Promise.resolve(guard.canActivate(context));
        if (canActivate) {
          return true;
        }
      } catch (err) {
        console.error('Guard failed:', guard.constructor.name, err);
      }
    }

    throw new UnauthorizedException();
  }
}
