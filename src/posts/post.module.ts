import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './providers/post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
