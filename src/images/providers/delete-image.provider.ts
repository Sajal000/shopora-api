import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from '../schemas/image.schema';
import { Product, ProductDocument } from 'src/posts/schemas/posts.schemas';

@Injectable()
export class DeleteImageProvider {
  constructor(
    /**
     * Inject mongoDb
     */
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,

    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  public async deleteImage(imageId: string, productId: string) {
    try {
      const post = await this.productModel.findOne({ _id: productId });
      if (!post) {
        throw new BadRequestException('Post does not exist!');
      }

      const image = await this.imageModel.findOne({ _id: imageId });
      if (!image) {
        throw new BadRequestException('Image does not exist!');
      }

      if (!post.featuredImages || !post.featuredImages.includes(imageId)) {
        throw new BadRequestException(
          'This image is not attached to the specified product!',
        );
      }

      await this.productModel.findByIdAndUpdate(
        productId,
        { $pull: { featuredImages: imageId } },
        { new: true },
      );

      const deleteResult = await this.imageModel.deleteOne({ _id: imageId });

      if (deleteResult.deletedCount === 0) {
        throw new BadRequestException('Failed to delete image');
      }

      return { message: 'Image deleted successfully!', success: true };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to delete image!`,
      });
    }
  }
}
