import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag, TagsDocument } from 'src/tags/schemas/tags.schemas';
import { DeletePostDto } from '../dto/delete-post.dto';

@Injectable()
export class DeleteUserPostProvider {
  constructor(
    /**
     * Inject mongoDB
     */
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    /**
     * Inject mongoDB
     */
    @InjectModel(Tag.name)
    private readonly tagModel: Model<TagsDocument>,
  ) {}

  public async deletePost(deletePostDto: DeletePostDto, userId: string) {
    const { postId } = deletePostDto;
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('User does not exist!');
      }

      const post = await this.productModel.findOne({ _id: postId });
      if (!post) {
        throw new BadRequestException('Post does not exist!');
      }

      user.userPosts = user.userPosts
        ? user.userPosts.filter((id) => id !== postId)
        : [];
      await this.userRepository.save(user);

      await this.tagModel.updateMany(
        { posts: postId },
        { $pull: { posts: postId } },
      );

      await this.productModel.deleteOne({ _id: postId });
      return { message: 'Post deleted successfully' };
    } catch (error: unknown) {
      throw new InternalServerErrorException({
        message: (error as Error).message.split(':')[0],
        description: `Failed to delete post. Please try again`,
      });
    }
  }
}
