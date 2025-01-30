import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/users/provider/user.service';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { SignInDto } from '../dto/signin.dto';
import { RefreshToken } from '../dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject signInProvider
     */
    @Inject()
    private readonly signInProvider: SignInProvider,
    /**
     * Inject refreshTokenProvider
     */
    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(refreshTokenDto: RefreshToken) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
