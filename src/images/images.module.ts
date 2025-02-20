import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './schemas/image.schema';
import { ImagesController } from './images.controller';
import { ImagesService } from './providers/images.service';
import { UploadImageProvider } from './providers/upload-image.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Product, ProductSchema } from 'src/posts/schemas/posts.schemas';
import { DeleteImageProvider } from './providers/delete-image.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Image.name, schema: ImageSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, UploadImageProvider, DeleteImageProvider],
  exports: [ImagesService],
})
export class ImagesModule {}
