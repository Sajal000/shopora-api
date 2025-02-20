import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tag, TagsDocument } from '../schemas/tags.schemas';
import { Model } from 'mongoose';
import { CreateTagsDto } from '../dto/create-tags.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';
import { FetchTagsQueryDto } from '../dto/fetch-tag-details.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModelMDB: Model<Tag>,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject MongoosePagination provider
     */
    private readonly mongoosePagination: MongoosePagination,
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
      return { message: 'Tag is posted!', tag: existingTag };
    }

    const newTag = new this.tagModel({ ...createTagsDto, usageCount: 1 });
    await newTag.save();

    if (!user.userTags) {
      user.userTags = [];
    }

    if (!user.userTags.includes(newTag._id as string)) {
      user.userTags.push(newTag._id as string);
      await this.userRepository.save(user);
    }

    return { message: 'Tag is posted!', tag: newTag };
  }

  /**
   * Fetch multiple tags based on query parameters
   * @param fetchTagsQuery - DTO containing tag IDs, page, and limit
   * @returns Paginated<Tag>
   */
  public async findMultipleTags(
    fetchTagsQuery: FetchTagsQueryDto,
  ): Promise<Paginated<Tag>> {
    try {
      const { tagIds = [], page = 1, limit = 10 } = fetchTagsQuery;

      const filter = tagIds.length ? { _id: { $in: tagIds } } : {};

      return await this.mongoosePagination.paginateQuery<Tag>(
        { page, limit },
        this.tagModelMDB,
        filter,
      );
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to fetch tag details.`,
      });
    }
  }
}
