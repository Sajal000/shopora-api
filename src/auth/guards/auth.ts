import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { VerifiedUserGuard } from './account-verification/verified-user.guard';
import { AuthType } from '../enum/auth-type.enum';
import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

export const Auth = (authType: AuthType = AuthType.Bearer) => {
  return applyDecorators(
    SetMetadata(AUTH_TYPE_KEY, authType),
    UseGuards(JwtAuthGuard, VerifiedUserGuard),
  );
};
