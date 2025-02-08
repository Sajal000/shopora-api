import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePostDto {
  @ApiProperty({
    description: 'The IDs of the post you want to delete',
  })
  @IsString()
  @IsNotEmpty()
  postId: string;
}
