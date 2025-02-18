import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider';
import { MongoosePagination } from './providers/mongoose-pagination';

@Module({
  providers: [PaginationProvider, MongoosePagination],
  exports: [PaginationProvider, MongoosePagination],
})
export class PaginationModule {}
