import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DataSource } from 'typeorm';
import { User } from '../entities/users.entity';
import { Otp } from 'src/auth/entities/otp.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject mailServices
     */
    private readonly mailServices: MailService,
    /**
     * Inject dataSource
     */
    private readonly dataSource: DataSource,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.dataSource.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, {
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          `A user with the email "${createUserDto.email}" already exists.`,
        );
      }

      const newUser = manager.create(User, {
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      await manager.save(newUser);

      try {
        const generateOtp = Math.floor(100000 + Math.random() * 900000);

        const otpRecord = manager.create(Otp, {
          user: newUser,
          code: generateOtp,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
        });

        await manager.save(otpRecord);

        await this.mailServices.sendMailWithTemplate(
          newUser.email,
          'Welcome to Shopora!',
          'welcome',
          { name: newUser.firstName, email: newUser.email },
        );

        await this.mailServices.sendMailWithTemplate(
          newUser.email,
          'Your account verification code',
          'otp-verification',
          { name: newUser.firstName, otp: generateOtp },
        );

        return newUser;
      } catch (error: unknown) {
        throw new InternalServerErrorException({
          message: (error as Error).message.split(':')[0],
          description: `Failed to send verification email, user creation aborted.`,
        });
      }
    });
  }
}
