import { IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get user details with specific ID',
  })
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  id?: string;
}
