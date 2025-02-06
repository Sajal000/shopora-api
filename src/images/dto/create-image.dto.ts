import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({ description: 'The url of the image' })
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  url: string;

  @ApiPropertyOptional({ description: 'The description of the image' })
  @IsOptional()
  @MinLength(1)
  @IsString()
  description: string;
}
