import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get user details with specific ID',
    example: 101,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
