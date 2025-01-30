import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshToken {
  @ApiProperty({
    description: 'Enter the refresh token',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
