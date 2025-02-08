import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { AttachTagsToPostDto } from './dto/attach-tags-to-post.dto';
import { DeletePostDto } from './dto/delete-post.dto';
import { PatchPostDto } from './dto/patch-post.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostController {
  constructor(
    /**
     * Inject postService
     */
    private readonly postService: PostService,
  ) {}

  /**
   * Uploading a new post
   * @param userId
   * @param createPostDto
   * @returns
   */
  @ApiOperation({ summary: 'Uploading a new post' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded a post' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Post('/:userId')
  public async uploadPost(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postService.uploadPost(createPostDto, userId);
  }

  /**
   * Fetch users posts
   * @param userId
   * @returns
   */
  @ApiOperation({ summary: 'Fetch users posts' })
  @ApiResponse({
    status: 201,
    description: 'Successfully fetched users posts!',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get('/:userId')
  public async fetchPosts(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    return await this.postService.fetchPosts(userId);
  }

  /**
   * Update an existing post
   * @param postId
   * @param patchPostDto
   * @returns
   */
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({ status: 200, description: 'Successfully deleted a post' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Patch('/:postId')
  public async patchPost(
    @Param('postId') postId: string,
    @Body() patchPostDto: PatchPostDto,
  ) {
    return await this.postService.patchPost(patchPostDto, postId);
  }

  /**
   * Delete an existing post
   * @param userId
   * @param deletePostDto
   * @returns
   */
  @ApiOperation({ summary: 'Delete an existing post' })
  @ApiResponse({ status: 200, description: 'Successfully deleted a post' })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Delete('/:userId')
  public async deletePost(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() deletePostDto: DeletePostDto,
  ) {
    return await this.postService.deletePost(deletePostDto, userId);
  }

  /**
   * Attaching tags to post
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
  @Patch(':postId/tags')
  public async attachTagToPost(
    @Param('postId') postId: string,
    @Body() tagIds: AttachTagsToPostDto,
  ) {
    return await this.postService.attachTagToPost(postId, tagIds);
  }

  /**
   * Detaching tags to post
   * @param postId
   * @param tagNames
   * @returns
   */
  @ApiOperation({ summary: 'Detaching tags of post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully detached tags of post',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Delete(':postId/tags')
  public async detachTagsFromPost(
    @Param('postId') postId: string,
    @Body() tagIds: AttachTagsToPostDto,
  ) {
    return await this.postService.detachTagToPost(postId, tagIds);
  }

  /**
   * Fetching tags to post
   * @param postId
   * @returns
   */
  @ApiOperation({ summary: 'Fetching tags of post' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched tags of post',
  })
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @Get(':postId/tags')
  public async fetchTagsOfPost(@Param('postId') postId: string) {
    return await this.postService.fetchTagsOfPost(postId);
  }
}
