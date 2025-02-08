import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tag, TagsDocument } from 'src/tags/schemas/tags.schemas';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { AttachTagsToPostDto } from '../dto/attach-tags-to-post.dto';

@Injectable()
export class AttachTagToPostProvider {
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
  public async addTagsToPost(
    postId: string,
    attachTagsToPostDto: AttachTagsToPostDto,
  ) {
    const { tagIds } = attachTagsToPostDto;
    const post = await this.productModel.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestException('Post does not exist!');
    }

    const tags = await this.tagModel.find({ _id: { $in: tagIds } });
    if (!tags.length) {
      throw new BadRequestException('No valid tags found!');
    }

    const existingTagIds = new Set(
      (post.tags ?? []).map((tagId) => tagId.toString()),
    );

    const newTagIds = tags
      .map((tag) => tag._id as string)
      .filter((tagId) => !existingTagIds.has(tagId));

    if (newTagIds.length === 0) {
      return { message: 'Tags already attached to post', post };
    }

    post.tags = post.tags ?? [];
    post.tags.push(...newTagIds.map((id) => new mongoose.Types.ObjectId(id)));
    await post.save();

    await this.tagModel.updateMany(
      { _id: { $in: newTagIds } },
      {
        $addToSet: { posts: postId },
        $inc: { usageCount: 1 },
      },
    );

    return { message: 'Tags successfully attached to post', post };
  }
}
