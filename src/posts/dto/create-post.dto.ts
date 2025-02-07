import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductCondition } from '../enums/product-condition.enum';

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

  @ApiPropertyOptional({ description: 'Size of the product' })
  @IsString()
  @MinLength(1)
  @MaxLength(12)
  @IsOptional()
  productSize: string;

  @ApiPropertyOptional({ description: 'Size of the product' })
  @IsEnum(ProductCondition)
  @MinLength(1)
  @MaxLength(200)
  @IsOptional()
  productCondition: ProductCondition;

  @ApiProperty({ description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  productPrice: number;
}
