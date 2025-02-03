import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject hashingProvider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  /**
   * Creates a new user
   * @param createUserDto - Data Transfer Object containing user details
   * @returns Promise<User>
   * @throws BadRequestException if the user already exists
   * @throws InternalServerErrorException if a database error occurs
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new BadRequestException(
          `A user with the email "${createUserDto.email}" already exists.`,
        );
      }

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to create user.`,
      });
    }
  }
}
