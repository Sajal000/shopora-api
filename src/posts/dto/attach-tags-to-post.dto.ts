import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AttachTagsToPostDto {
  @ApiProperty({
    description: 'The IDs of the tags you want to attach to the post',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tagIds: string[];
}
