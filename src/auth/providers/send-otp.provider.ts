import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailService } from 'src/mail/providers/mail.service';
import { Otp } from '../entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { SendOTPDto } from '../dto/otp.dto';

@Injectable()
export class SendOtpProvider {
  private readonly logger = new Logger(SendOtpProvider.name);

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
      this.logger.log(`Received OTP request for email: ${sendOtpDto.email}`);

      const user = await this.userRepository.findOne({
        where: { email: sendOtpDto.email },
      });

      if (!user) {
        this.logger.warn(`User not found for email: ${sendOtpDto.email}`);
        throw new BadRequestException(
          'Failed to find user. Please check your email',
        );
      }

      this.logger.log(`User found: ${user.id}, checking existing OTPs`);

      const checkOtp = await this.otpRepository.findOne({
        where: { user: user, used: false },
        order: { createdAt: 'DESC' },
      });

      if (checkOtp) {
        this.logger.warn(`Existing OTP found, expiring it.`);
        checkOtp.expiresAt = new Date(Date.now());
        await this.otpRepository.save(checkOtp);
      }

      // Generate a 6-digit OTP
      const generateOtp = Math.floor(100000 + Math.random() * 900000);

      const newOtp = this.otpRepository.create({
        user: user,
        code: generateOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 mins
      });

      this.logger.log(`Generated OTP: ${generateOtp} for user: ${user.email}`);

      // Save OTP in database
      await this.otpRepository.save(newOtp);
      this.logger.log(`OTP saved in DB for user: ${user.email}`);

      const userFName = user.firstName;

      // Send OTP email
      this.logger.log(`Attempting to send OTP email to: ${user.email}`);

      await this.mailServices.sendMailWithTemplate(
        user.email,
        q === 'forgot-password'
          ? 'Your forgot password verification code'
          : 'Your account verification code',
        q === 'forgot-password' ? 'forgot-password-otp' : 'otp-verification',
        { name: userFName, otp: generateOtp },
      );

      this.logger.log(`OTP email sent successfully to: ${user.email}`);

      return { message: 'OTP sent successfully' };
    } catch (error: unknown) {
      this.logger.error(
        `Failed to send OTP to ${sendOtpDto.email}: ${(error as Error).message}`,
      );

      throw new InternalServerErrorException({
        message: 'Failed to send OTP',
        description: `Error: ${(error as Error).message}`,
        stack: (error as Error).stack, // Include the stack trace for debugging
      });
    }
  }
}
