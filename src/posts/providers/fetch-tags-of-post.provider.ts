import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from 'src/tags/schemas/tags.schemas';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class FetchTagsOfPostProvider {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<Tag>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    /**
     * Inject MongoosePagination provider
     */
    private readonly mongoosePagination: MongoosePagination,
  ) {}
  public async fetchTagsOfPost(
    postId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Tag>> {
    try {
      const post = await this.productModel.findOne({ _id: postId }).lean();
      if (!post) {
        throw new BadRequestException('Post does not exist');
      }

      return await this.mongoosePagination.paginateQuery<Tag>(
        paginationQuery,
        this.tagModel,
        { posts: postId },
      );
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find post's tags`,
      });
    }
  }
}
