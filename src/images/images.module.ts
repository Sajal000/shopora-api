import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './providers/images.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService]
})
export class ImagesModule {}
