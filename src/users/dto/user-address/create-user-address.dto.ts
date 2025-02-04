import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({
    description: 'Street address',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  streetAddress: string;

  @ApiProperty({
    description: 'Street address two',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(96)
  streetAddressTwo: string;

  @ApiProperty({
    description: 'City',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  city: string;

  @ApiProperty({
    description: 'State',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  state: string;

  @ApiProperty({
    description: 'Postal Code',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[0-9]+$/)
  postalCode: string;

  @ApiProperty({
    description: 'Country',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(56)
  country: string;
}
