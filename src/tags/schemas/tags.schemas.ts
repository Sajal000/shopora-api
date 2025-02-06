import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Product } from 'src/posts/schemas/posts.schemas';

export type TagsDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, unique: true, maxlength: 30 })
  name: string;

  @Prop({ required: false, maxlength: 500 })
  description?: string;

  @Prop({ type: Number, default: 0, required: false })
  usageCount?: number;

  @Prop({ type: Date, required: false })
  createdAt?: Date;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Product', required: true }],
    default: [],
  })
  post: Product;
}

export const TagsSchema = SchemaFactory.createForClass(Tag);
