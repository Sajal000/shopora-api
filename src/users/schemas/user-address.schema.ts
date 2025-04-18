import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserAddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true, maxlength: 96 })
  streetAddress: string;

  @Prop({ required: false, maxlength: 96 })
  streetAddressTwo: string;

  @Prop({ required: true, maxlength: 96 })
  city: string;

  @Prop({ required: true, maxlength: 96 })
  state: string;

  @Prop({ required: true, minlength: 3, maxlength: 10, match: /^[0-9]+$/ })
  postalCode: string;

  @Prop({ required: true, maxlength: 56 })
  country: string;

  @Prop({ type: String, required: true, unique: true })
  userId: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
