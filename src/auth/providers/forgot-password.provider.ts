import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ForgotPasswordOTPDto } from '../dto/otp.dto';
import { UserService } from 'src/users/providers/user.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';

interface DecodedToken {
  otpVerified: boolean;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class ForgotPassword {
  constructor(
    /**
     * Inject userService
     */
    private readonly userService: UserService,
    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,
  ) {}

  public async verifyForgotPassword(
    forgotPasswordOtpDto: ForgotPasswordOTPDto,
  ) {
    const { newPassword, tempToken } = forgotPasswordOtpDto;

    try {
      const decoded: DecodedToken = this.jwtService.verify(tempToken);

      if (!decoded.otpVerified || !decoded.email) {
        throw new BadRequestException('OTP verification is required');
      }

      const user = await this.userService.findUserByEmail(decoded.email);
      const hashedPassword =
        await this.hashingProvider.hashPassword(newPassword);
      user.password = hashedPassword;

      await this.userService.patch(user.id, { password: hashedPassword });

      return { message: 'Password changed successfully!' };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: 'Failed to change password',
        description: `${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
