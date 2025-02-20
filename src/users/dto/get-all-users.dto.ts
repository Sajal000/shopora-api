import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

export class GetUsersDto extends IntersectionType(PaginationQueryDto) {}
