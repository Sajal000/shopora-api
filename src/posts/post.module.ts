import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './posts.controller';
import { PostService } from './providers/post.service';
import { UploadPostProvider } from './providers/upload-post.provider';
import { AttachTagToPostProvider } from './providers/attach-tag-to-post.provider';
import { Product, ProductSchema } from './schemas/posts.schemas';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Tag, TagsSchema } from 'src/tags/schemas/tags.schemas';
import { FetchTagsOfPostProvider } from './providers/fetch-tags-of-post.provider';
import { PatchPostProvider } from './providers/patch-post.provider';
import { FetchUserPostProvider } from './providers/fetch-user-post.provider';
import { DeleteUserPostProvider } from './providers/delete-user-post.provider';
import { DetachTagsFromPost } from './providers/detach-tags-from-post';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';
import { FetchImagesOfPostProvider } from './providers/fetch-images-of-post.provider';
import { Image, ImageSchema } from 'src/images/schemas/image.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Tag.name, schema: TagsSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    UploadPostProvider,
    AttachTagToPostProvider,
    FetchTagsOfPostProvider,
    PatchPostProvider,
    FetchUserPostProvider,
    DeleteUserPostProvider,
    DetachTagsFromPost,
    MongoosePagination,
    FetchImagesOfPostProvider,
  ],
  exports: [PostService],
})
export class PostModule {}
