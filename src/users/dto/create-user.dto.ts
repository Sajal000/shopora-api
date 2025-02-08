import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name of the users',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the users',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  lastName: string;

  @ApiProperty({
    description: 'Email of the users',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    {
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(15)
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message:
      'Phone number must be a valid international phone number in E.164 format (e.g., +1234567890)',
  })
  phoneNumber: string;
}
