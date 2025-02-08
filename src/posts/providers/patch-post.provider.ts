import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { Model } from 'mongoose';
import { PatchPostDto } from '../dto/patch-post.dto';

@Injectable()
export class PatchPostProvider {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  public async patchPost(postId: string, patchPostDto: PatchPostDto) {
    const post = await this.productModel.findOne({ _id: postId });
    if (!post) {
      throw new BadRequestException('Post does not exist!');
    }

    Object.assign(post, patchPostDto);
    await post.save();
    return post;
  }
}
