import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagsDocument } from '../schemas/tags.schemas';
import { Model } from 'mongoose';
import { CreateTagsDto } from '../dto/create-tags.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
  ) {}

  public async post(createTagsDto: CreateTagsDto) {
    const existingTag = await this.tagModel.findOne({
      name: createTagsDto.name,
    });

    if (existingTag) {
      return await this.tagModel.findByIdAndUpdate(
        existingTag._id,
        { $inc: { usageCount: 1 } },
        { new: true },
      );
    }

    const newTag = new this.tagModel({ ...createTagsDto, usageCount: 1 });
    return await newTag.save();
  }

  public async findMultipleTags(tagIds: string[]) {
    const result = await this.tagModel.find({ _id: { $in: tagIds } });
    return result;
  }
}
