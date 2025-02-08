import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { Tag, TagsDocument } from 'src/tags/schemas/tags.schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DetachTagsToPostDto } from '../dto/detach-tags-from-post.dto';

@Injectable()
export class DetachTagsFromPost {
  constructor(
    /**
     * Inject mongoDB for Products
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    /**
     * Inject mongoDB for Tags
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
  ) {}

  public async detachTagsFromPost(
    postId: string,
    detachTagsFromPost: DetachTagsToPostDto,
  ) {
    const { tagIds } = detachTagsFromPost;
    try {
      const objectTagIds = tagIds.map((id) => new mongoose.Types.ObjectId(id));

      const post = await this.productModel.findOne({ _id: postId });
      if (!post) {
        throw new NotFoundException('Post does not exist!');
      }

      await this.productModel.updateOne(
        { _id: postId },
        { $pull: { tags: { $in: objectTagIds } } },
      );

      await this.tagModel.updateMany(
        { _id: { $in: objectTagIds } },
        { $pull: { posts: postId }, $inc: { usageCount: -1 } },
      );

      return { message: 'Tags detached from post successfully!' };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to detach tags from post. Please try again`,
      });
    }
  }
}
