import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(96)
  oldPassword: string;

  @ApiProperty({
    description: 'New password',
  })
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
  newPassword: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;
}
