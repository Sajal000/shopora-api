import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImageDocument = Image & Document;

@Schema({ timestamps: true })
export class Image {
  @Prop({
    type: {
      original: { type: String, required: true },
      thumbnail: { type: String },
      medium: { type: String },
    },
    required: true,
  })
  urls: {
    original: string;
    thumbnail?: string;
    medium?: string;
  }[];

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, required: true })
  mimeType: string;

  @Prop({ default: '', required: false })
  altText?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
