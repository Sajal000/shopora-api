import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { PatchUserAddressDto } from 'src/users/dto/user-address/patch-user-address.dto';
import { User } from 'src/users/entities/users.entity';
import {
  Address,
  UserAddressDocument,
} from 'src/users/schemas/user-address.schema';
import { Repository } from 'typeorm';

@Injectable()
export class PatchUserAddressProvider {
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

  public async patchUserAddress(
    patchUserAddressDto: PatchUserAddressDto,
    userId: string,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException(`User does not exist!`);
      }
      const address = await this.addressModel.findOne({ userId }).lean();
      if (!address) {
        throw new NotFoundException(`No address is attached to user!`);
      }
      Object.assign(address, patchUserAddressDto);
      await this.addressModel.updateOne({ id: userId }, address);
      return `Address updated for user!`;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to update user's address.`,
      });
    }
  }
}
