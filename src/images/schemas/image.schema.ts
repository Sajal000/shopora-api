import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({ required: true })
  url: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Number, required: true })
  authorId: number;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
