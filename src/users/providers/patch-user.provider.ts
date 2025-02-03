import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PatchUserDto } from '../dto/patch-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PatchUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Updates an existing user's details
   * @param id - The ID of the user to update
   * @param patchUserDto - Partial user data for updating
   * @returns Promise<User>
   * @throws NotFoundException if the user is not found
   * @throws InternalServerErrorException if an update error occurs
   */
  public async patchUser(
    id: number,
    patchUserDto: PatchUserDto,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found.`);
      }

      Object.assign(user, patchUserDto);
      return await this.usersRepository.save(user);
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to update user with ID: ${id}.`,
      });
    }
  }
}
