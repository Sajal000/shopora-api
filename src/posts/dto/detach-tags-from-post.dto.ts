import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class DetachTagsToPostDto {
  @ApiProperty({
    description: 'The IDs of the tags you want to detach from post',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tagIds: string[];
}
