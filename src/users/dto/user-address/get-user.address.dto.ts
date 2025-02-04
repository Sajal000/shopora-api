import { IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUserAddressParamDto {
  @ApiPropertyOptional({
    description: `Get user's address details`,
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  addressId: string;
}
