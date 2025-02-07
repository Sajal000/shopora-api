import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailService } from 'src/mail/providers/mail.service';
import { Otp } from '../entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { SendOTPDto } from '../dto/otp.dto';

@Injectable()
export class SendOtpProvider {
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
     * Inject mailServices
     */
    private readonly mailServices: MailService,
  ) {}

  public async sendOtp(sendOtpDto: SendOTPDto, q: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: sendOtpDto.email },
      });

      if (!user) {
        throw new BadRequestException(
          'Failed to find user. Please check your email',
        );
      }

      const checkOtp = await this.otpRepository.findOne({
        where: { user: user, used: false },
        order: { createdAt: 'DESC' },
      });

      if (checkOtp) {
        checkOtp.expiresAt = new Date(Date.now());
        await this.otpRepository.save(checkOtp);
      }

      // Generate a 6-digit OTP
      const generateOtp = Math.floor(100000 + Math.random() * 900000);
      console.log('Generated OTP:', generateOtp);

      const newOtp = this.otpRepository.create({
        user: user,
        code: generateOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 mins
      });

      console.log('New OTP record:', newOtp);

      // Save OTP in database
      await this.otpRepository.save(newOtp);

      const userFName = user.firstName;

      // Send OTP email
      await this.mailServices.sendMailWithTemplate(
        user.email,
        q === 'forgot-password'
          ? 'Your forgot password verification code'
          : 'Your account verification code',
        q === 'forgot-password' ? 'forgot-password-otp' : 'otp-verification',
        { name: userFName, otp: generateOtp },
      );

      return { message: 'OTP sent successfully' };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: 'Failed to send OTP',
        description: `${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
