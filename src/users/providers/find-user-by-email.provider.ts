import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Find a user by email
   * @param email - The email address of the user
   * @returns Promise<User>
   * @throws NotFoundException if the user does not exist
   * @throws InternalServerErrorException if there is a database error
   */
  public async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException(`User with email "${email}" not found.`);
      }

      return user;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find user with email: ${email}.`,
      });
    }
  }
}
