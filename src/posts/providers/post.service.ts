import { Injectable } from '@nestjs/common';
import { UploadPostProvider } from './upload-post.provider';
import { AttachTagToPostProvider } from './attach-tag-to-post.provider';
import { CreatePostDto } from '../dto/create-post.dto';
import { FetchTagsOfPostProvider } from './fetch-tags-of-post.provider';
import { Tag } from 'src/tags/schemas/tags.schemas';
import { AttachTagsToPostDto } from '../dto/attach-tags-to-post.dto';
import { DeletePostDto } from '../dto/delete-post.dto';
import { PatchPostProvider } from './patch-post.provider';
import { PatchPostDto } from '../dto/patch-post.dto';
import { FetchUserPostProvider } from './fetch-user-post.provider';
import { DeleteUserPostProvider } from './delete-user-post.provider';
import { DetachTagsFromPost } from './detach-tags-from-post';
import { Product } from '../schemas/posts.schemas';
import { Paginated } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { FetchImagesOfPostProvider } from './fetch-images-of-post.provider';
import { Image } from 'src/images/schemas/image.schema';

@Injectable()
export class PostService {
  constructor(
    /**
     * Inject uploadPostProvider
     */
    private readonly uploadPostProvider: UploadPostProvider,
    /**
     * Inject fetchUserPostProvider
     */
    private readonly fetchUserPostProvider: FetchUserPostProvider,
    /**
     * Inject attachTagsWithPostProvider
     */
    private readonly attachTagsWithPostProvider: AttachTagToPostProvider,
    /**
     * Inject detachTagsFromPostProvider
     */
    private readonly detachTagsFromPostProvider: DetachTagsFromPost,
    /**
     * Inject patchPostProvider
     */
    private readonly patchPostProvider: PatchPostProvider,
    /**
     * Inject deletePostsProvider
     */
    private readonly deletePostProvider: DeleteUserPostProvider,
    /**
     * Inject fetchTagsProvider
     */
    private readonly fetchTagsProvider: FetchTagsOfPostProvider,
    /**
     * Inject fetchImagesProvider
     */
    private readonly fetchImagesProvider: FetchImagesOfPostProvider,
  ) {}

  public async uploadPost(createPostDto: CreatePostDto, userId: string) {
    return await this.uploadPostProvider.uploadProduct(createPostDto, userId);
  }

  public async fetchPosts(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Product>> {
    return await this.fetchUserPostProvider.fetchPosts(userId, paginationQuery);
  }

  public async patchPost(patchPostDto: PatchPostDto, postId: string) {
    return await this.patchPostProvider.patchPost(postId, patchPostDto);
  }

  public async deletePost(deletePostDto: DeletePostDto, userId: string) {
    return await this.deletePostProvider.deletePost(deletePostDto, userId);
  }

  public async attachTagToPost(postId: string, tagIds: AttachTagsToPostDto) {
    return await this.attachTagsWithPostProvider.addTagsToPost(postId, tagIds);
  }

  public async detachTagToPost(postId: string, tagIds: AttachTagsToPostDto) {
    return await this.detachTagsFromPostProvider.detachTagsFromPost(
      postId,
      tagIds,
    );
  }

  public async fetchTagsOfPost(
    postId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Tag>> {
    return await this.fetchTagsProvider.fetchTagsOfPost(
      postId,
      paginationQuery,
    );
  }

  public async fetchImagesOfPost(
    postId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<Paginated<Image>> {
    return await this.fetchImagesProvider.fetchImagesOfPost(
      postId,
      paginationQuery,
    );
  }
}
