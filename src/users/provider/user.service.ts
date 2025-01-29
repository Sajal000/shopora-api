import { Injectable } from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByGoogleProvider } from './find-user-by-google.provider';
import { CreateGoogleUserProvider } from './create-google-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users.entity';
import { Repository } from 'typeorm';

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
     * Injecting usersRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   *
   * @param createUserDto
   * @returns new user
   */
  public async create(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   * Retrieve all users from the database.
   * @returns An array of users
   */
  public async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
