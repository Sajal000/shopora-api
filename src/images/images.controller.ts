import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
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
import { Response } from 'express';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enum/auth-type.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  @ApiOperation({ summary: 'Upload an image' })
  @ApiResponse({ status: 201, description: 'Successfully uploaded an image' })
  @Post('/:authorId/:productId')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  public async uploadImage(
    @Param('authorId') authorId: string,
    @Param('productId') productId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await this.imageService.uploadImages(files, authorId, productId);
  }

  @Auth(AuthType.VerifiedBearer)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Fetch an image via ID' })
  @ApiResponse({ status: 200, description: 'Successfully fetched an image' })
  @Get('/:imageId')
  public async getImage(
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ) {
    const image = await this.imageService.findImageById(imageId);

    if (!image || !image.urls.length || !image.urls[0].original) {
      throw new NotFoundException('Image not found');
    }

    res.setHeader('Content-Type', image.mimeType);
    res.sendFile(image.urls[0].original, { root: './' });
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
