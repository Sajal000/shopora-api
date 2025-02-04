import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { AuthType } from './enum/auth-type.enum';
import { SignInDto } from './dto/signin.dto';
import { Auth } from './decorator/auth.decorator';
import { RefreshToken } from './dto/refresh-token.dto';
import { ForgotPasswordOTPDto, SendOTPDto, VerifyOTPDto } from './dto/otp.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    /**
     * Inject authService
     */
    private readonly authService: AuthService,
  ) {}

  /**
   *
   * @param signInDto
   * @returns
   */
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

  /**
   * generates refreshToken
   * @param refreshToken
   * @returns authToken and refreshToken
   */
  @ApiBearerAuth('refresh-token')
  @ApiOperation({
    summary: 'Takes in refresh token to generate new auth token',
  })
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  @Post('refresh-token')
  public async refreshToken(@Body() refreshToken: RefreshToken) {
    return await this.authService.refreshToken(refreshToken);
  }

  /**
   *
   * @param sendOtpDto
   * @param query
   * @returns
   */
  @ApiOperation({
    summary: 'Send the user a OTP',
  })
  @ApiQuery({
    name: 'q',
    description: 'Expected value: reset-password or void',
    required: false,
  })
  @Auth(AuthType.None)
  @Post('send-otp')
  public async sendOtp(
    @Body() sendOtpDto: SendOTPDto,
    @Query() query: { q: string },
  ) {
    return await this.authService.sendOtp(sendOtpDto, query.q);
  }

  /**
   *
   * @param verifyOtpDto
   * @param query
   * @returns
   */
  @ApiOperation({
    summary: `Verify the user's OTP`,
  })
  @ApiQuery({
    name: 'q',
    description: 'Expected value: reset-password or void',
    required: false,
  })
  @Auth(AuthType.None)
  @Post('verify-otp')
  public async verifyOtp(
    @Body() verifyOtpDto: VerifyOTPDto,
    @Query() query: { q: string },
  ) {
    return await this.authService.verifyOtp(verifyOtpDto, query.q);
  }

  /**
   *
   * @param forgotPasswordOtpDto
   * @returns
   */
  @ApiOperation({
    summary: `Handle users forgot password request`,
  })
  @Auth(AuthType.None)
  @Post('forgot-password')
  public async forgotPassword(
    @Body() forgotPasswordOtpDto: ForgotPasswordOTPDto,
  ) {
    return await this.authService.forgotPassword(forgotPasswordOtpDto);
  }

  /**
   *
   * @param updatePasswordDto
   * @returns
   */
  @Auth()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: `Updates password for logged users`,
  })
  @Post('update-password')
  public async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return await this.authService.updatePassword(updatePasswordDto);
  }
}
