// src/app/core/application/interfaces/base-repository.ts
import { Observable } from 'rxjs';
import { PaginatedResult } from '../entities/paginated-result';
import { ResultWithMessage } from '../entities/result';

export abstract class BaseRepository<TEntity, TId, TQuery> {
  // find operations
  abstract findAll(): Observable<TEntity[] | ResultWithMessage<TEntity[]>>;
  // Not necessary for this test
  abstract findById(id: TId): Observable<TEntity | null>;
  abstract findByQuery(
    query: TQuery
  ): Observable<
    PaginatedResult<TEntity> | ResultWithMessage<PaginatedResult<TEntity>>
  >;

  abstract exists(id: TId): Observable<boolean | ResultWithMessage<boolean>>;

  // write operations
  abstract create(
    entity: Partial<TEntity>
  ): Observable<TEntity | ResultWithMessage<TEntity>>;

  abstract update(
    id: TId,
    entity: Partial<TEntity>
  ): Observable<TEntity | ResultWithMessage<TEntity>>;

  abstract delete(id: TId): Observable<void | ResultWithMessage<void>>;

  // Not necessary for this test
  // bulk operations
  //   createMany(entities: TCreateDto[]): Observable<TEntity[]>;
  //   updateMany(
  //     updates: Array<{ id: TId; data: TUpdateDto }>
  //   ): Observable<TEntity[]>;
  //   deleteMany(ids: TId[]): Observable<void>;
}
