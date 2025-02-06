import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { status } from '../enums/post-status.enum';

export class CreatePostDto {
  @ApiProperty({ description: 'Title of the post' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @IsNotEmpty()
  productTitle: string;

  @ApiProperty({ description: 'Description of the product' })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @IsNotEmpty()
  productDescription: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  productPrice: number;

  @ApiProperty({
    description: 'The status of the post',
    enum: status,
  })
  @IsEnum(status)
  @IsNotEmpty()
  status: status;

  @ApiPropertyOptional({
    description: 'The date the post was published',
  })
  @IsOptional()
  @IsISO8601()
  publishedOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tag IDs (MongoDB ObjectIds)',
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Array of featured image URLs',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuredImages?: string[];
}
