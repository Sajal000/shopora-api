import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { AuthType } from './enum/auth-type.enum';
import { SignInDto } from './dto/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { RefreshToken } from './dto/refresh-token.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    /**
     * Inject authService
     */
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'Login user with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in!',
  })
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Generates refresh token',
  })
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @Post('refresh-token')
  public async refreshToken(@Body() refreshToken: RefreshToken) {
    return await this.authService.refreshToken(refreshToken);
  }
}
