import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './providers/tags.service';
import { TagController } from './tags.controller';
import { Tag, TagsSchema } from './schemas/tags.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagsSchema }]),
  ],
  providers: [TagsService],
  controllers: [TagController],
  exports: [TagsService],
})
export class TagsModule {}
