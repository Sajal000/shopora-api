import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Address,
  UserAddressDocument,
} from '../../schemas/user-address.schema';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserAddressDto } from '../../dto/user-address/create-user-address.dto';

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

  public async createAddress(
    userId: number,
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User does not exist!`);
      }

      const existingAddress = await this.addressModel.findOne({ userId });
      if (existingAddress) {
        throw new BadRequestException('Address already exists for this user!');
      }

      const address = await this.addressModel.create({
        ...createUserAddressDto,
        userId,
      });

      if (!address._id) {
        throw new InternalServerErrorException('Address ID missing');
      }

      const addressId: string = address._id as unknown as string;

      user.addressId = addressId;
      await this.userRepository.save(user);

      return `Address created and attached to user!`;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          message: error.message.split(':')[0],
          description: `Failed to attach address to user. Please try again later`,
        });
      } else {
        throw new InternalServerErrorException({
          message: 'Unknown error',
          description: `Failed to attach address to user. Please try again later`,
        });
      }
    }
  }
}
