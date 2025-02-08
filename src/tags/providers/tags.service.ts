import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagsDocument } from '../schemas/tags.schemas';
import { Model } from 'mongoose';
import { CreateTagsDto } from '../dto/create-tags.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async post(userId: string, createTagsDto: CreateTagsDto) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException('User not found');
    }

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
    await newTag.save();

    user.userTags = [...(user.userTags || []), newTag._id as string];
    await this.userRepository.save(user);

    return newTag;
  }

  public async findMultipleTags(tagIds: string[]) {
    const result = await this.tagModel.find({ _id: { $in: tagIds } });
    return result;
  }
}
