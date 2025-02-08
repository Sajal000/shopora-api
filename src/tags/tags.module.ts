import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './providers/tags.service';
import { TagController } from './tags.controller';
import { Tag, TagsSchema } from './schemas/tags.schemas';
import { User } from 'src/users/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagsSchema }]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [TagsService],
  controllers: [TagController],
  exports: [TagsService],
})
export class TagsModule {}
