import { Injectable } from '@nestjs/common';
import { UploadPostProvider } from './upload-post.provider';
import { AttachTagToPostProvider } from './attach-tag-to-post.provider';
import { CreatePostDto } from '../dto/create-post.dto';
import { FetchTagsOfPostProvider } from './fetch-tags-of-post.provider';
import { Tag } from 'src/tags/schemas/tags.schemas';

@Injectable()
export class PostService {
  constructor(
    /**
     * Inject uploadPostProvider
     */
    private readonly uploadPostProvider: UploadPostProvider,
    /**
     * Inject attachTagsWithPostProvider
     */
    private readonly attachTagsWithPostProvider: AttachTagToPostProvider,
    /**
     * Inject fetchTagsProvider
     */
    private readonly fetchTagsProvider: FetchTagsOfPostProvider,
  ) {}

  public async uploadPost(createPostDto: CreatePostDto, userId: string) {
    return await this.uploadPostProvider.uploadProduct(createPostDto, userId);
  }

  public async attachTagToPost(postId: string, tagNames: string[]) {
    return await this.attachTagsWithPostProvider.addTagsToPost(
      postId,
      tagNames,
    );
  }

  public async fetchTagsOfPost(postId: string): Promise<Tag[]> {
    return await this.fetchTagsProvider.fetchTagsOfPost(postId);
  }
}
