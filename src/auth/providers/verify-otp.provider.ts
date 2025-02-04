import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';
import { User } from 'src/users/entities/users.entity';
import { VerifyOTPDto } from '../dto/otp.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyOtpProvider {
  constructor(
    /**
     * Inject OTP Repository
     */
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    /**
     * Inject user repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject jwtProvider
     */
    private readonly jwtService: JwtService,
  ) {}

  public async verifyOtp(verifyOtpDto: VerifyOTPDto, q: string) {
    const { email, otp } = verifyOtpDto;
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException(
          'Failed to find user. Please check your email',
        );
      }

      const otpRecord = await this.otpRepository.findOne({
        where: { user: { id: user.id }, code: otp, used: false },
      });

      if (!otpRecord) {
        throw new BadRequestException('Failed to find stored OTP.');
      }

      if (otpRecord.expiresAt < new Date()) {
        throw new BadRequestException('OTP has expired');
      }

      otpRecord.used = true;
      await this.otpRepository.save(otpRecord);

      if (!q) {
        user.verified = true;
        await this.userRepository.save(user);
        return 'User successfully verified!';
      }

      if (q === 'forgot-password') {
        const tempToken = this.jwtService.sign(
          { email, otpVerified: true },
          { expiresIn: '10m' },
        );
        return { message: 'OTP verified for forgot password!', tempToken };
      }
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: 'Failed to verify OTP',
        description: `${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
