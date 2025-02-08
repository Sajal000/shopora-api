import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagsDto {
  @ApiProperty({ description: 'Tag' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Tag description' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description?: string;
}
