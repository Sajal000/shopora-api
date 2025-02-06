import { Module } from '@nestjs/common';
import { TagsService } from './providers/tags.service';

@Module({
  providers: [TagsService],
})
export class TagsModule {}
