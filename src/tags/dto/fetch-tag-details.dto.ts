import { IsOptional, IsPositive, IsArray, IsMongoId } from 'class-validator';
import { Transform } from 'class-transformer';

export class FetchTagsQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number = 10;

  @IsOptional()
  @IsPositive()
  page: number = 1;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Transform(
    ({ value }) => (Array.isArray(value) ? value : [value]) as string[],
  )
  tagIds?: string[];
}
