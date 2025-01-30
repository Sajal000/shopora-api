import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByGoogleProvider } from './find-user-by-google.provider';
import { CreateGoogleUserProvider } from './create-google-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users.entity';
import { Repository } from 'typeorm';
import { PatchUserDto } from '../dto/patch-user.dto';
import { PatchUserProvider } from './patch-user.provide';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class UserService {
  constructor(
    /**
     * Injecting createUserProvider
     */
    private readonly createUserProvider: CreateUserProvider,
    /**
     * Injecting createGoogleUserProvider
     */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
    /**
     * Injecting findUserByEmail Provider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
    /**
     * Inject findByGoogleId Provider
     */
    private readonly findUserByGoogleIdProvider: FindUserByGoogleProvider,
    /**
     * Injecting patchUserProvider
     */
    private readonly patchUserProvider: PatchUserProvider,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Create a new user
   * @param createUserDto
   * @returns Promise<User>
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Create a new Google user
   * @param googleUser
   * @returns Promise<User>
   */
  public async createGoogleUser(googleUser: GoogleUser): Promise<User> {
    return this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

  /**
   * Retrieve all users
   * @returns Promise<User[]>
   */
  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find user by email
   * @param email
   * @returns Promise<User>
   */
  public async findUserByEmail(email: string): Promise<User> {
    return this.findUserByEmailProvider.findUserByEmail(email);
  }

  /**
   * Find user by Google ID
   * @param googleId
   * @returns Promise<User>
   */
  public async findUserByGoogleId(googleId: string) {
    return this.findUserByGoogleIdProvider.findUserByGoogle(googleId);
  }

  /**
   * Find user by ID
   * @param id
   * @returns Promise<User>
   */
  public async findById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException({
          message: 'User not found',
          description: `No user exists in the database with ID: ${id}.`,
        });
      }

      return user;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to retrieve user with ID: ${id}.`,
      });
    }
  }

  /**
   * Update user details
   * @param id
   * @param patchUserDto
   * @returns Promise<User>
   */
  public async patch(id: number, patchUserDto: PatchUserDto): Promise<User> {
    return this.patchUserProvider.patchUser(id, patchUserDto);
  }

  /**
   * Delete user by ID
   * @param id
   * @returns Promise<DeleteResult>
   */
  public async delete(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException({
          message: 'User not found',
          description: `No user exists in the database with ID: ${id}.`,
        });
      }
      await this.usersRepository.delete(id);

      return { message: `User with id ${id} deleted`, deleted: true };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to delete user with ID: ${id}.`,
      });
    }
  }
}
