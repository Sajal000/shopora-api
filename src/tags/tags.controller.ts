import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagsService } from './providers/tags.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { CreateTagsDto } from './dto/create-tags.dto';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { Tag } from './schemas/tags.schemas';
import { FetchTagsQueryDto } from './dto/fetch-tag-details.dto';

@Controller('tags')
@ApiTags('Tags')
export class TagController {
  constructor(
    /**
     * Inject tagsService
     */
    private readonly tagService: TagsService,
  ) {}

  /**
   * Upload a tag
   * @param createTagDto
   * @returns
   */
  @ApiOperation({ summary: 'Upload a tag' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded a tag' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post('/:userId')
  public async uploadTags(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createTagDto: CreateTagsDto,
  ) {
    return await this.tagService.post(userId, createTagDto);
  }

  /**
   * Get multiple tags by their IDs
   * @param tagIds - List of tag IDs
   */
  @ApiOperation({ summary: 'Get tag details via tagId' })
  @ApiResponse({ status: 200, description: 'Successfully fetched tag details' })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Number of tags per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'tagIds',
    type: 'array',
    required: false,
    description: 'Array of tag IDs to filter',
    example: ['6547b9c3f1c0f5b8a6d6e8c1', '6547b9c3f1c0f5b8a6d6e8c2'],
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get()
  public async getTags(
    @Query() fetchTagsQuery: FetchTagsQueryDto,
  ): Promise<Paginated<Tag>> {
    return await this.tagService.findMultipleTags(fetchTagsQuery);
  }
}
