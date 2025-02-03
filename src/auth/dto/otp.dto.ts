import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SendOTPDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;
}

export class VerifyOTPDto {
  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'The OTP sent to the user' })
  @IsNumber()
  otp: number;
}

export class ForgotPasswordOTPDto {
  @ApiProperty({ description: 'The token from OTP Verification' })
  @IsNotEmpty()
  tempToken: string;

  @ApiProperty({
    description: 'New password of the user',
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
  newPassword: string;
}
