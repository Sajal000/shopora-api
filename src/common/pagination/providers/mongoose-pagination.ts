import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Paginated } from '../interfaces/pagination.interface';

@Injectable()
export class MongoosePagination {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T>(
    paginationQuery: PaginationQueryDto,
    model: Model<T>,
    filter: Record<string, any> = {},
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 10 } = paginationQuery;

    const safeLimit = limit > 0 ? limit : 10;
    const safePage = page > 0 ? page : 1;

    const results = await model
      .find(filter)
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .select('-__v')
      .lean();

    const totalItems = await model.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / safeLimit);

    const baseURL =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newURL = new URL(this.request.url, baseURL);

    const nextPage = safePage < totalPages ? safePage + 1 : null;
    const previousPage = safePage > 1 ? safePage - 1 : null;

    return {
      data: results as T[],
      meta: {
        itemsPerPage: safeLimit,
        totalItems: totalItems,
        currentPage: safePage,
        totalPage: totalPages,
      },
      links: {
        first: `${newURL.origin}${newURL.pathname}?limit=${safeLimit}&page=1`,
        last: `${newURL.origin}${newURL.pathname}?limit=${safeLimit}&page=${totalPages}`,
        current: `${newURL.origin}${newURL.pathname}?limit=${safeLimit}&page=${safePage}`,
        next: nextPage
          ? `${newURL.origin}${newURL.pathname}?limit=${safeLimit}&page=${nextPage}`
          : '',
        previous: previousPage
          ? `${newURL.origin}${newURL.pathname}?limit=${safeLimit}&page=${previousPage}`
          : '',
      },
    };
  }
}
