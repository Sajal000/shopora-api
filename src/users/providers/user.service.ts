import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';
import { FindUserByGoogleProvider } from './google-providers/find-user-by-google.provider';
import { CreateGoogleUserProvider } from './google-providers/create-google-user';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { PatchUserDto } from '../dto/patch-user.dto';
import { PatchUserProvider } from './patch-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';
import { CreateUserAddressProvider } from './address-providers/create-user-address.provider';
import { CreateUserAddressDto } from '../dto/user-address/create-user-address.dto';
import { PatchUserAddressProvider } from './address-providers/patch-user-address.provider';
import { PatchUserAddressDto } from '../dto/user-address/patch-user-address.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Address, UserAddressDocument } from '../schemas/user-address.schema';
import { Model } from 'mongoose';

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
    /**
     * Inject createUserAddressProvider
     */
    private readonly createAddressProvider: CreateUserAddressProvider,
    /**
     * Inject patchUserAddressProvider
     */
    private readonly patchUserAddressProvider: PatchUserAddressProvider,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Address.name)
    private addressModel: Model<UserAddressDocument>,
  ) {}

  /**
   *
   * @param createUserDto
   * @returns
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    return this.createUserProvider.createUser(createUserDto);
  }

  /**
   *
   * @param googleUser
   * @returns
   */
  public async createGoogleUser(googleUser: GoogleUser): Promise<User> {
    return this.createGoogleUserProvider.createGoogleUser(googleUser);
  }

  /**
   *
   * @returns all users
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
  public async findById(id: string): Promise<User> {
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
        description: `Failed to retrieve user.`,
      });
    }
  }

  /**
   * Update user details
   * @param id
   * @param patchUserDto
   * @returns Promise<User>
   */
  public async patch(id: string, patchUserDto: PatchUserDto): Promise<User> {
    return this.patchUserProvider.patchUser(id, patchUserDto);
  }

  /**
   * Delete user by ID
   * @param id
   * @returns Promise<DeleteResult>
   */
  public async delete(id: number) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id.toString() });

      if (!user) {
        throw new BadRequestException({
          message: 'User not found',
          description: `User does not exists`,
        });
      }
      await this.usersRepository.delete(id);

      return { message: `User deleted!`, deleted: true };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to delete user`,
      });
    }
  }

  /**
   * Attaches address to user
   * @param userId
   * @param addressData
   */
  public async addAddress(
    userId: string,
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<string> {
    return this.createAddressProvider.createAddress(
      userId,
      createUserAddressDto,
    );
  }

  /**
   * Update address of existing user
   * @param userId
   * @param patchUserAddressDto
   */

  public async patchAddress(
    userId: string,
    patchUserAddressDto: PatchUserAddressDto,
  ) {
    await this.patchUserAddressProvider.patchUserAddress(
      patchUserAddressDto,
      userId,
    );
  }

  /**
   * fetch address of user
   * @param userId
   * @returns
   */
  public async fetchAddress(userId: string): Promise<Address> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });

      if (!user) {
        throw new NotFoundException(`User does not exist!`);
      }

      const address = await this.addressModel.findOne({ userId }).lean();

      if (!address) {
        throw new NotFoundException(`No address is attached to user!`);
      }
      return address;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find user's address`,
      });
    }
  }

  public async deleteAddress(userId: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });

      if (!user) {
        throw new NotFoundException('User does not exist');
      }

      const address = await this.addressModel.findOne({ userId }).lean();

      if (!address) {
        throw new NotFoundException('No address is attached to user!');
      }

      await this.addressModel.deleteOne({ userId });

      user.addressId = null;
      await this.usersRepository.save(user);

      return { message: `Address deleted!`, deleted: true };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to delete user's address. `,
      });
    }
  }
}
