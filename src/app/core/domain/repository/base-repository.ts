// src/app/core/application/interfaces/base-repository.ts
import { Observable } from 'rxjs';
import { PaginatedResult } from '../entities/paginated-result';
import { ResultWithMessage } from '../entities/result';

export interface BaseRepository<TEntity, TId, TQuery> {
  // find operations
  findAll(): Observable<TEntity[] | ResultWithMessage<TEntity[]>>;
  // Not necessary for this test
  //   findById(id: TId): Observable<TEntity | null>;
  findByQuery(
    query: TQuery
  ): Observable<
    PaginatedResult<TEntity> | ResultWithMessage<PaginatedResult<TEntity>>
  >;

  exists(id: TId): Observable<boolean | ResultWithMessage<boolean>>;

  // write operations
  create(
    entity: Partial<TEntity>
  ): Observable<TEntity | ResultWithMessage<TEntity>>;

  update(
    id: TId,
    entity: Partial<TEntity>
  ): Observable<TEntity | ResultWithMessage<TEntity>>;

  delete(id: TId): Observable<void | ResultWithMessage<void>>;

  // Not necessary for this test
  // bulk operations
  //   createMany(entities: TCreateDto[]): Observable<TEntity[]>;
  //   updateMany(
  //     updates: Array<{ id: TId; data: TUpdateDto }>
  //   ): Observable<TEntity[]>;
  //   deleteMany(ids: TId[]): Observable<void>;
}
