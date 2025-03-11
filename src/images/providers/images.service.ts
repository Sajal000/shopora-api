import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadImageProvider } from './upload-image.provider';
import { MulterFile } from '../interfaces/multer-file.interface';
import { DeleteImageProvider } from './delete-image.provider';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from '../schemas/image.schema';

@Injectable()
export class ImagesService {
  constructor(
    /**
     * Inject uploadImageProvider
     */
    private readonly uploadImageProvider: UploadImageProvider,
    /**
     * Inject deleteImageProvider
     */
    private readonly deleteImageProvider: DeleteImageProvider,
    /**
     * Inject mongoDb
     */
    @InjectModel(Image.name)
    private readonly imageModel: Model<ImageDocument>,
  ) {}

  /**
   * Upload an image
   * @param files
   * @param authorId
   * @param productId
   * @returns
   */
  public async uploadImages(
    files: MulterFile[],
    authorId: string,
    productId: string,
  ) {
    return await this.uploadImageProvider.uploadImages(
      files,
      authorId,
      productId,
    );
  }

  /**
   * Delete an image
   * @param imageId
   * @param productId
   * @returns
   */
  public async deleteImage(imageId: string, productId: string) {
    return await this.deleteImageProvider.deleteImage(imageId, productId);
  }

  async findImageById(imageId: string) {
    const image = await this.imageModel.findById(imageId).lean();
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
