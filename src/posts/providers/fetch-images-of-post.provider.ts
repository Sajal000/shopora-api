import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from 'src/images/schemas/image.schema';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';

@Injectable()
export class FetchImagesOfPostProvider {
  constructor(
    /**
     * Inject mongoDb
     */
    @InjectModel(Image.name) private readonly imageModel: Model<Image>,
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

  public async fetchImagesOfPost(
    postId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Image>> {
    try {
      const post = await this.productModel.findOne({ _id: postId }).lean();
      if (!post) {
        throw new BadRequestException('Post does not exist');
      }
      return await this.mongoosePagination.paginateQuery<Image>(
        paginationQuery,
        this.imageModel,
        { productId: postId },
      );
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find post's images`,
      });
    }
  }
}
