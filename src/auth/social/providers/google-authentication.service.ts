import {
  forwardRef,
  Inject,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';
import { UserService } from 'src/users/provider/user.service';
import { GoogleTokenDto } from '../dto/google-token.dto';

export class GoogleAuthenticationService implements OnModuleInit {
  private oauthClient: OAuth2Client;

  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;
    this.oauthClient = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    try {
      const loginTicket = await this.oauthClient.verifyIdToken({
        idToken: googleTokenDto.token,
      });

      const payload = loginTicket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const {
        email,
        sub: googleId,
        given_name: firstName,
        family_name: lastName,
      } = payload;

      const user = await this.userService.findUserByGoogleId(googleId);

      if (user) {
        return this.generateTokensProvider.generateToken(user);
      }

      const newUser = await this.userService.createGoogleUser({
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        googleId: googleId,
      });

      return this.generateTokensProvider.generateToken(newUser);
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        description: `Token verification failed: ${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
