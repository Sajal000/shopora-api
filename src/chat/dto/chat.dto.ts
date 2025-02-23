import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  @IsString()
  content: string;
}
