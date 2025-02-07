import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schemas/posts.schemas';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class UploadPostProvider {
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
  ) {}

  public async uploadProduct(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException('Failed to connect with user');
    }

    const post = new this.productModel({
      ...createPostDto,
      author: user.id,
    });

    return await post.save();
  }
}
