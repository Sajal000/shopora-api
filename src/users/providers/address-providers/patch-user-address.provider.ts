import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { GetUsersParamDto } from 'src/users/dto/get-user.dto';
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
    userId: GetUsersParamDto,
  ): Promise<string> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId.id });
      if (!user) {
        throw new NotFoundException(`User does not exist!`);
      }
      const address = await this.addressModel.findOne({ id: userId.id });
      if (!address) {
        throw new NotFoundException(`No address is attached to user!`);
      }
      Object.assign(address, patchUserAddressDto);
      await this.addressModel.updateOne({ id: userId.id }, address);
      return `Address updated for user!`;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to update user's address.`,
      });
    }
  }
}
