import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Image, ImageDocument } from '../schemas/image.schema';
import mongoose, { Model } from 'mongoose';
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
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,
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
  ) {
    try {
      console.log('Received productId for image upload:', productId);

      const user = await this.userRepository.findOneBy({ id: authorId });
      if (!user) {
        throw new BadRequestException('Failed to connect with user');
      }

      const mongoProductId = new mongoose.Types.ObjectId(productId);

      const post = await this.productModel
        .findOne({ _id: mongoProductId })
        .lean();
      if (!post) {
        throw new BadRequestException('Post does not exist in MongoDB');
      }

      if (!files || files.length === 0) {
        throw new BadRequestException(
          'No files uploaded. Please attach at least one file.',
        );
      }

      const savedImages = await Promise.all(
        files.map(async (file) => {
          const imageDoc = new this.imageModel({
            urls: { original: file.path, thumbnail: '', medium: '' },
            size: file.size,
            mimeType: file.mimetype,
            authorId,
            productId,
          });
          return await imageDoc.save();
        }),
      );

      const imageUrls = savedImages.map(
        (image) =>
          (image.urls as unknown as { original: string }).original || '',
      );

      await this.productModel.findByIdAndUpdate(
        productId,
        {
          $push: { featuredImages: { $each: imageUrls } },
        },
        { new: true },
      );
      return { savedImages: savedImages, imageUrls: imageUrls };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to upload image!`,
      });
    }
  }
}
