import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FetchUserPostProvider {
  constructor(
    /**
     * Inject MongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    /**
     * Inject PostgreSQL User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async fetchPosts(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new BadRequestException('User does not exist!');
      }

      const posts = await this.productModel.find({ author: userId }).lean();

      return posts;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to fetch user's posts. Please try again`,
      });
    }
  }
}
