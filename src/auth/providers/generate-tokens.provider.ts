import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interfaces';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  public async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  public async generateToken(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id.toString(),
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
          verified: user.verified,
        },
      ),
      this.signToken<Partial<ActiveUserData>>(
        user.id.toString(),
        this.jwtConfiguration.refreshTokenTtl,
        {
          email: user.email,
          verified: user.verified,
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
