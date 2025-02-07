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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Tag.name, schema: TagsSchema },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    UploadPostProvider,
    AttachTagToPostProvider,
    FetchTagsOfPostProvider,
  ],
  exports: [PostService],
})
export class PostModule {}
