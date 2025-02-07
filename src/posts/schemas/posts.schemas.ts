import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Tag } from 'src/tags/schemas/tags.schemas';
import { ProductCondition } from '../enums/product-condition.enum';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, type: String, maxlength: 50 })
  productTitle: string;

  @Prop({ required: true, type: String, maxlength: 200 })
  productDescription: string;

  @Prop({ required: false, type: String, maxlength: 12 })
  productSize: string;
  @Prop({
    type: String,
    enum: Object.values(ProductCondition),
    required: false,
  })
  productCondition: ProductCondition;

  @Prop({ required: true, type: Number, min: 0 })
  productPrice: number;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ required: false })
  publishedOn?: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', default: [] })
  tags?: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  featuredImages?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
