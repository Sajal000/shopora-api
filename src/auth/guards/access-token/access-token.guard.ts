import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AccessTokenGuard triggered');

    const request: Request = context.switchToHttp().getRequest<Request>();
    const token = this.extractRequestFromHeader(request);

    console.log('Extracted Token:', token);

    if (!token) {
      console.log('No token found');
      throw new UnauthorizedException('No token found in the request.');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      console.log('Decoded JWT Payload:', payload);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      request[REQUEST_USER_KEY] = payload;
    } catch (error: unknown) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException(error, {
        description: 'Failed to authorize user',
      });
    }
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
