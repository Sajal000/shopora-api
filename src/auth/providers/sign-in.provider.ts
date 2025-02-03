import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/providers/user.service';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { SignInDto } from '../dto/signin.dto';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject hashing provider
     */
    @Inject()
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signIn: SignInDto) {
    const user = await this.userService.findUserByEmail(signIn.email);

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signIn.password,
        user.password,
      );
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid or expired refresh token',
        description: `Token verification failed: ${(error as Error).message.split(':')[0]}.`,
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    return await this.generateTokensProvider.generateToken(user);
  }
}
