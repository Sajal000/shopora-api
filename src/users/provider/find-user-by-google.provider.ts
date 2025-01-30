import {
  NotFoundException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class FindUserByGoogleProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Find a user by their Google ID
   * @param googleId - The Google ID of the user
   * @returns Promise<User>
   * @throws NotFoundException if no user is found
   */
  public async findUserByGoogle(googleId: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ googleId });

      if (!user) {
        throw new NotFoundException(
          `No user found with Google ID: ${googleId}`,
        );
      }

      return user;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to retrieve user with Google ID: ${googleId}.`,
      });
    }
  }
}
