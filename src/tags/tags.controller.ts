import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagsService } from './providers/tags.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { CreateTagsDto } from './dto/create-tags.dto';

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
  @Post()
  public async uploadTags(@Body() createTagDto: CreateTagsDto) {
    return await this.tagService.post(createTagDto);
  }

  /**
   * Get multiple tags by their IDs
   * @param tagIds - List of tag IDs
   */
  @ApiOperation({ summary: 'Get tag details via tagId' })
  @ApiResponse({ status: 200, description: 'Successfully fetched tag details' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get()
  public async getTags(@Query('tagIds') tagIds: string[]) {
    return await this.tagService.findMultipleTags(tagIds);
  }
}
