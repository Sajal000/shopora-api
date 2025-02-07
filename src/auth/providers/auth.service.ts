import { Inject, Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { SignInDto } from '../dto/signin.dto';
import { RefreshToken } from '../dto/refresh-token.dto';
import { SendOtpProvider } from './send-otp.provider';
import { ForgotPasswordOTPDto, SendOTPDto, VerifyOTPDto } from '../dto/otp.dto';
import { VerifyOtpProvider } from './verify-otp.provider';
import { ForgotPassword } from './forgot-password.provider';
import { UpdatePassword } from './update-password.provider';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject signInProvider
     */
    @Inject()
    private readonly signInProvider: SignInProvider,
    /**
     * Inject refreshTokenProvider
     */
    private readonly refreshTokenProvider: RefreshTokensProvider,
    /**
     * Inject sendOtpProvider
     */
    private readonly sendOtpProvider: SendOtpProvider,
    /**
     * Inject verifyOtpProvider
     */
    private readonly verifyOtpProvider: VerifyOtpProvider,
    /**
     * Inject forgotPasswordProvider
     */
    private readonly forgotPasswordProvider: ForgotPassword,
    /**
     * Inject updatePasswordProvider
     */
    private readonly updatePasswordProvider: UpdatePassword,
  ) {}
  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(refreshTokenDto: RefreshToken) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  public async sendOtp(sendOtpDto: SendOTPDto, q: string) {
    return await this.sendOtpProvider.sendOtp(sendOtpDto, q);
  }

  public async verifyOtp(verifyOtpDto: VerifyOTPDto, q: string) {
    return await this.verifyOtpProvider.verifyOtp(verifyOtpDto, q);
  }

  public async forgotPassword(forgotPasswordOtpDto: ForgotPasswordOTPDto) {
    return await this.forgotPasswordProvider.verifyForgotPassword(
      forgotPasswordOtpDto,
    );
  }

  public async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    return await this.updatePasswordProvider.updatePassword(updatePasswordDto);
  }
}
