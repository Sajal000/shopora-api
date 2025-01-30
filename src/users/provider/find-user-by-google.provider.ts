import { Injectable } from '@nestjs/common';
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
   *
   */
  public async findUserByGoogle(googleId: string) {
    return await this.usersRepository.findOneBy({ googleId });
  }
}
