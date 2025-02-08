import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagsDocument } from 'src/tags/schemas/tags.schemas';
import { Product, ProductDocument } from '../schemas/posts.schemas';

@Injectable()
export class FetchTagsOfPostProvider {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}
  public async fetchTagsOfPost(postId: string): Promise<Tag[]> {
    try {
      const post = await this.productModel.findOne({ _id: postId }).lean();
      if (!post) {
        throw new BadRequestException('Post does not exist');
      }

      const tags = await this.tagModel.find({ posts: postId }).lean();

      return tags;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find post's tags`,
      });
    }
  }
}
