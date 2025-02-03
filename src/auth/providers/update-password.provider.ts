import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/providers/user.service';

@Injectable()
export class UpdatePassword {
  constructor(
    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword, email } = updatePasswordDto;

    try {
      const user = await this.userService.findUserByEmail(email);

      const isEqual = await this.hashingProvider.comparePassword(
        oldPassword,
        user.password,
      );

      if (!isEqual) {
        throw new BadRequestException(
          'Old password does not match with the current password',
        );
      }

      const hashedNewPassword =
        await this.hashingProvider.hashPassword(newPassword);

      await this.userRepository.update(
        { email },
        { password: hashedNewPassword },
      );

      return { message: 'Password successfully updated!' };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: 'Failed to update password',
        description: `${(error as Error).message.split(':')[0]}.`,
      });
    }
  }
}
