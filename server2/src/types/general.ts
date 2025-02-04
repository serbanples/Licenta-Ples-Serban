/** Generally used interfaces */

export interface ResourceWithPagination<T> {
  result: T[];
  pagination: {
      fromItem: number;
      perPage: number;
      count: number;
      totalPages: number;
      totalCount: number;
  }
}

export interface QueryPaginationFilter {
  fromItem?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}