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
      const post = await this.productModel.findOne({ id: postId });
      if (!post) {
        throw new BadRequestException('Post does not exist');
      }

      const tagsDocument = await this.tagModel.findOne({ postId }).lean();
      const tags: Tag[] = tagsDocument ? [tagsDocument] : [];

      return tags;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to find post's tags`,
      });
    }
  }
}
