import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, UserAddressDocument } from '../schemas/user-address.schema';
import { Model, Types } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUserAddressProvider {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Address.name)
    private addressModel: Model<UserAddressDocument>,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createAddress(userId: number, addressData: Partial<Address>) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const address = await this.addressModel.create({
        ...addressData,
        userId,
      });

      if (!address._id) {
        throw new InternalServerErrorException('Address ID missing');
      }

      const addressId: string = (address._id as Types.ObjectId).toString();

      user.addressId = addressId;
      await this.userRepository.save(user);

      return { message: 'Address created attached to user!', user, address };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: error.message.split(':')[0],
          description: `Failed to create user.`,
        });
      } else {
        throw new InternalServerErrorException({
          message: 'Unknown error',
          description: `Failed to create user.`,
        });
      }
    }
  }
}
