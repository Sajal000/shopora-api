import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTagsDto {
  @ApiProperty({ description: 'Tag names' })
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

  @ApiPropertyOptional({ description: 'Usage count of tags' })
  @IsInt()
  @Min(0)
  @IsOptional()
  usageCount?: number;

  @ApiPropertyOptional({ description: 'Time tag was created' })
  @IsISO8601()
  @IsOptional()
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Time tag was deleted' })
  @IsISO8601()
  @IsOptional()
  deletedAt?: Date;
}
