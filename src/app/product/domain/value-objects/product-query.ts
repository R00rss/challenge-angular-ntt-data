import { BaseQuery } from '@/app/core/domain/value-objects/base-query';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { SortCriteria } from '@/app/core/domain/value-objects/sort-criteria';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { ProductCriteria } from './product-criteria';

export class ProductQuery extends BaseQuery<ProductCriteria, ProductEntity> {
  constructor(
    criteria: ProductCriteria = new ProductCriteria(),
    pagination: Pagination = new Pagination(),
    sorting?: SortCriteria<ProductEntity>
  ) {
    super(criteria, pagination, sorting);
  }

  static create(params: {
    searchTerm?: string;
    page?: number;
    pageSize?: number;
    sortBy?: keyof ProductEntity;
    sortDirection?: 'asc' | 'desc';
  }): ProductQuery {
    const criteria = new ProductCriteria(params.searchTerm);
    const pagination = new Pagination(params.page, params.pageSize);
    const sorting = params.sortBy
      ? new SortCriteria(params.sortBy, params.sortDirection)
      : undefined;

    return new ProductQuery(criteria, pagination, sorting);
  }
}
