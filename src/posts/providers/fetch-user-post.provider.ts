import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schemas/posts.schemas';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';

@Injectable()
export class FetchUserPostProvider {
  constructor(
    /**
     * Inject MongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    /**
     * Inject PostgreSQL User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject MongoosePagination provider
     */
    private readonly mongoosePagination: MongoosePagination,
  ) {}

  public async fetchPosts(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Product>> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new BadRequestException('User does not exist!');
      }

      return await this.mongoosePagination.paginateQuery<Product>(
        paginationQuery,
        this.productModel,
        { author: userId },
      );
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to fetch user's posts. Please try again`,
      });
    }
  }
}
