import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from '../schemas/image.schema';
import { Model } from 'mongoose';
import { MulterFile } from '../interfaces/multer-file.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Product, ProductDocument } from 'src/posts/schemas/posts.schemas';

@Injectable()
export class UploadImageProvider {
  constructor(
    /**
     * Inject mongoDb
     */
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  public async uploadImages(
    files: MulterFile[],
    authorId: string,
    productId: string,
  ): Promise<Image[]> {
    try {
      const user = await this.userRepository.findOneBy({ id: authorId });
      if (!user) {
        throw new BadRequestException('Failed to connect with user');
      }

      const post = await this.productModel.findOne({ _id: productId });
      if (!post) {
        throw new BadRequestException('Post does not exist!');
      }

      const savedImages = await Promise.all(
        files.map(async (file) => {
          const imageDoc = new this.imageModel({
            urls: { original: file.path },
            size: file.size,
            mimeType: file.mimetype,
            authorId,
            productId,
          });
          return await imageDoc.save();
        }),
      );

      const imageIds = savedImages.map((image) => image._id);

      await this.productModel.findByIdAndUpdate(
        productId,
        {
          $push: { featuredImages: { search: imageIds } },
        },
        { new: true },
      );

      return savedImages;
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to upload image!`,
      });
    }
  }
}
