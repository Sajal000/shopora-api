import { Injectable } from '@nestjs/common';
import { UploadImageProvider } from './upload-image.provider';
import { MulterFile } from '../interfaces/multer-file.interface';
import { DeleteImageProvider } from './delete-image.provider';

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
}
