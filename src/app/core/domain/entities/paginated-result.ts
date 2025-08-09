import { Pagination } from '../value-objects/pagination';

export class PaginatedResult<T> {
  constructor(
    public readonly items: T[],
    public readonly totalItems: number,
    public readonly pagination: Pagination
  ) {}

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pagination.pageSize);
  }

  get currentPage(): number {
    return this.pagination.page;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  static empty<T>(
    pagination: Pagination = new Pagination()
  ): PaginatedResult<T> {
    return new PaginatedResult<T>([], 0, pagination);
  }
}
