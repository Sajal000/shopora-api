import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './providers/post.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
@ApiTags('Posts')
export class PostController {
  constructor(
    /**
     * Inject postService
     */
    private readonly postService: PostService,
  ) {}

  /**
   *
   * @param userId
   * @param createPostDto
   * @returns
   */
  @ApiOperation({ summary: 'Uploading a new post' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded a post' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post('upload/:userId')
  public async uploadPost(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.uploadPost(createPostDto, userId);
  }

  /**
   *
   * @param postId
   * @param tagNames
   * @returns
   */
  @ApiOperation({ summary: 'Attaching tags to post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully attached tags to post',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post(':postId/tags')
  public async attachTagToPost(
    @Param('postId') postId: string,
    @Body('tags') tagNames: string[],
  ) {
    return await this.postService.attachTagToPost(postId, tagNames);
  }

  /**
   *
   * @param postId
   * @param tagNames
   * @returns
   */
  @ApiOperation({ summary: 'Fetching tags to post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched tags to post',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get(':postId/tags')
  public async fetchTagsOfPost(@Param('postId') postId: string) {
    return await this.postService.fetchTagsOfPost(postId);
  }
}
