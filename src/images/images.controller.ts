import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImagesService } from './providers/images.service';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
  constructor(
    /**
     * Inject imagesService
     */
    private readonly imageService: ImagesService,
  ) {}

  /**
   *
   * @param authorId
   * @param productId
   * @param files
   * @returns
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files', multerConfig))
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded an image' })
  @Post('/:authorId/:productId')
  public async uploadImage(
    @Param('authorId') authorId: string,
    @Param('product') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.imageService.uploadImages(files, authorId, productId);
  }

  /**
   *
   * @param imageId
   * @param productId
   * @returns
   */
  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an image' })
  @ApiResponse({ status: 200, description: 'Successfully deleted an image' })
  @Delete('/:productId/:imageId')
  public async deleteImage(
    @Param('imageId') imageId: string,
    @Param('productId') productId: string,
  ) {
    return await this.imageService.deleteImage(imageId, productId);
  }
}
