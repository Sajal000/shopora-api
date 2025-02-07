import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagsDocument } from 'src/tags/schemas/tags.schemas';
import { Product, ProductDocument } from '../schemas/posts.schemas';

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
  public async addTagsToPost(postId: string, tagNames: string[]) {
    const existingTags = await this.tagModel.find({ name: { $in: tagNames } });

    const existingTagNames = new Set(existingTags.map((tag) => tag.name));

    const newTagNames = tagNames.filter((name) => !existingTagNames.has(name));

    const newTags = await this.tagModel.insertMany(
      newTagNames.map((name) => ({ name, usageCount: 1 })),
    );

    await this.tagModel.updateMany(
      { name: { $in: existingTagNames } },
      { $inc: { usageCount: 1 } },
    );

    const allTagIds = [
      ...existingTags.map((tag) => tag._id),
      ...newTags.map((tag) => tag._id),
    ];

    return await this.productModel.findByIdAndUpdate(
      postId,
      { $set: { tags: allTagIds } },
      { new: true },
    );
  }
}
