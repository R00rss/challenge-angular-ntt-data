import { Pagination } from './pagination';
import { SortCriteria } from './sort-criteria';

export abstract class BaseQuery<TCriteria, TEntity> {
  constructor(
    public readonly criteria: TCriteria,
    public readonly pagination: Pagination = new Pagination(),
    public readonly sorting?: SortCriteria<TEntity>
  ) {}
}
