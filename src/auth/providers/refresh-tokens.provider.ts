import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/providers/user.service';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshToken } from '../dto/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interfaces';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Refreshes an access token using a valid refresh token
   * @param refreshTokenDto - The refresh token data
   * @returns A new set of tokens
   * @throws UnauthorizedException if the token is invalid or expired
   */
  public async refreshToken(refreshTokenDto: RefreshToken) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userService.findById(sub.toString());
      if (!user) {
        throw new UnauthorizedException({
          message: 'User not found',
          description: `No user exists in the database`,
        });
      }

      return await this.generateTokensProvider.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        description: `Token verification failed: ${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
