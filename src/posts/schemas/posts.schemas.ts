import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tag } from 'src/tags/schemas/tags.schemas';
import { status } from '../enums/post-status.enum';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, type: String, maxlength: 50 })
  productTitle: string;

  @Prop({ required: true, type: String, maxlength: 200 })
  productDescription: string;

  @Prop({ required: true, type: Number, min: 0 })
  productPrice: number;

  @Prop({ required: true, type: status, default: status.DRAFT })
  status: status;

  @Prop({ type: Number, required: true })
  authorId: number;

  @Prop({ required: false })
  publishedOn?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }], default: [] })
  tags?: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  featuredImages?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
