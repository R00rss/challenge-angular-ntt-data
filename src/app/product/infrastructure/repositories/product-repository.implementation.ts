import { ProductRepository } from '@/app/product/domain/repositories/product-repository';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, switchMap } from 'rxjs';
import { delay } from 'rxjs/operators';
import ProductEntity from '../../domain/entities/product.entity';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { ProductMapper } from '../mapper/product.mapper';
import { ApiError } from '../errors/api-errors';
import {
  ApiErrorResponse,
  DeleteProductsApiResponse,
  ExistsApiResponse,
  GetProductById,
  GetProductsApiResponse,
  PostProductsApiResponse,
  UpdateProductsApiResponse,
} from '../dto/product-api.dto';
import { ResultWithMessage } from '@/app/core/domain/entities/result';

@Injectable()
class HttpProductRepository implements ProductRepository {
  private readonly baseUrl = '/api/products';

  constructor(private readonly httpClient: HttpClient) {}

  findById(id: string): Observable<ProductEntity | null> {
    return this.httpClient.get<GetProductById>(`${this.baseUrl}/${id}`).pipe(
      map((response) => {
        if (response) {
          return ProductMapper.fromDto(response);
        }
        return null;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  findAll(): Observable<ProductEntity[]> {
    return this.httpClient.get<GetProductsApiResponse>(this.baseUrl).pipe(
      map((response) => ProductMapper.fromDtoList(response.data)),
      delay(1000),
      catchError((error) => this.handleError(error))
    );
  }

  create(entity: ProductEntity): Observable<ResultWithMessage<ProductEntity>> {
    const dto = ProductMapper.toDto(entity);
    return this.httpClient
      .post<PostProductsApiResponse>(this.baseUrl, dto)
      .pipe(
        map((response) => ({
          data: ProductMapper.fromDto(response.data),
          message: response.message,
        })),
        catchError((error) => this.handleError(error))
      );
  }

  createWithValidation(
    entity: ProductEntity
  ): Observable<ResultWithMessage<ProductEntity>> {
    return this.exists(entity.id).pipe(
      switchMap((exists) => {
        if (exists) {
          return throwError(
            () => new Error('Entity with this ID already exists')
          );
        }
        return this.create(entity);
      })
    );
  }

  exists(id: string): Observable<ExistsApiResponse> {
    const url = `${this.baseUrl}/verification/${id}`;
    return this.httpClient.get<ExistsApiResponse>(url);
  }

  delete(id: string): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.delete<DeleteProductsApiResponse>(url).pipe(
      map(() => undefined),
      catchError((error) => this.handleError(error))
    );
  }

  findByQuery(query: ProductQuery): Observable<PaginatedResult<ProductEntity>> {
    const allResults = this.findAll();
    const resultsPaginated = allResults.pipe(
      map((products) => {
        const filteredProducts = products.filter((product) =>
          query.criteria.matches(product)
        );

        const totalItems = filteredProducts.length;
        const startIndex =
          (query.pagination.page - 1) * query.pagination.pageSize;
        const endIndex = startIndex + query.pagination.pageSize;

        const pagination = new Pagination(
          query.pagination.page,
          query.pagination.pageSize
        );

        return new PaginatedResult<ProductEntity>(
          filteredProducts.slice(startIndex, endIndex),
          totalItems,
          pagination
        );
      })
    );
    return resultsPaginated;
  }

  update(
    id: string,
    entity: Omit<ProductEntity, 'id'>
  ): Observable<ProductEntity> {
    const url = `${this.baseUrl}/${id}`;
    const auxEntity: ProductEntity = { ...entity, id };
    const dto = ProductMapper.toDto(auxEntity);
    return this.httpClient.put<UpdateProductsApiResponse>(url, dto).pipe(
      map((response) => ProductMapper.fromDto(response.data)),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let apiError: ApiError;

    if (error.error && typeof error.error === 'object') {
      const errorResponse = error.error as ApiErrorResponse;
      apiError = ApiError.fromResponse(errorResponse, error.status);

      console.error('Structured API Error:', {
        statusCode: error.status,
        errorName: errorResponse.name,
        message: errorResponse.message,
        url: error.url,
        timestamp: new Date().toISOString(),
      });
    } else {
      apiError = new ApiError(
        error.message || 'Unknown error occurred',
        error.status || 0
      );

      console.error('Network or Unstructured Error:', {
        statusCode: error.status,
        message: error.message,
        url: error.url,
        timestamp: new Date().toISOString(),
      });
    }
    return throwError(() => apiError);
  }
}

export default HttpProductRepository;
