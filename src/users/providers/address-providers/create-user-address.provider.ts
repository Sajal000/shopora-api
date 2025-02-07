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
    private readonly addressModel: Model<UserAddressDocument>,

    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async createAddress(
    userId: string,
    createUserAddressDto: CreateUserAddressDto,
  ): Promise<string> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User does not exist!`);
    }

    // Check if user already has an address in MongoDB
    const existingAddress = await this.addressModel.findOne({ userId }).lean();
    if (existingAddress) {
      throw new BadRequestException('Address already exists for this user!');
    }

    // Create new address entry in MongoDB
    const address = await this.addressModel.create({
      ...createUserAddressDto,
      userId,
    });

    if (!address._id) {
      throw new InternalServerErrorException('Failed to generate address ID');
    }

    // Attach newly created address ID to user entity in PostgreSQL
    user.addressId = address._id as unknown as string;
    await this.userRepository.save(user);

    return 'Address created and attached to user!';
  }
}
