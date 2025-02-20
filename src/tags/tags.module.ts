import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './providers/tags.service';
import { TagController } from './tags.controller';
import { Tag, TagsSchema } from './schemas/tags.schemas';
import { User } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongoosePagination } from 'src/common/pagination/providers/mongoose-pagination';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagsSchema }]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [TagsService, MongoosePagination],
  controllers: [TagController],
  exports: [TagsService],
})
export class TagsModule {}
