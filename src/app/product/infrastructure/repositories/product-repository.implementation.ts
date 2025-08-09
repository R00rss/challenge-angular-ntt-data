import { ProductRepository } from '@/app/product/domain/repositories/product-repository';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, switchMap } from 'rxjs';
import ProductEntity from '../../domain/entities/product.entity';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { ProductMapper } from '../mapper/product.mapper';
import { ApiError } from '../errors/api-errors';
import {
  ApiErrorResponse,
  DeleteProductsApiResponse,
  GetProductsApiResponse,
  PostProductsApiResponse,
  UpdateProductsApiResponse,
} from '../dto/product-api.dto';
import { ResultWithMessage } from '@/app/core/domain/entities/result';

@Injectable()
class HttpProductRepository implements ProductRepository {
  private readonly baseUrl = '/api/products';

  constructor(private readonly httpClient: HttpClient) {}

  findAll(): Observable<ProductEntity[]> {
    return this.httpClient.get<GetProductsApiResponse>(this.baseUrl).pipe(
      // map((response) => ProductMapper.fromDtoList(response.data)),
      //TODO: change this hardcode example
      map((response) =>
        ProductMapper.fromDtoList([
          {
            id: 'trj-crd',
            name: 'Tarjetas de Crédito',
            description: 'Tarjeta de consumo bajo la modalidad de crédito',
            logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
            date_release: '2023-02-01',
            date_revision: '2024-02-01',
          },
        ])
      ),
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

  exists(id: string): Observable<boolean> {
    const url = `${this.baseUrl}/verification/${id}`;
    return this.httpClient.get<boolean>(url);
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
    return this.httpClient.put<UpdateProductsApiResponse>(url, entity).pipe(
      map((response) => ProductMapper.fromDto(response.data)),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error); // Para desarrollo

    let apiError: ApiError;

    if (error.error && typeof error.error === 'object') {
      // Error estructurado de la API
      const errorResponse = error.error as ApiErrorResponse;
      apiError = ApiError.fromResponse(errorResponse, error.status);

      // Log estructurado para producción
      console.error('Structured API Error:', {
        statusCode: error.status,
        errorName: errorResponse.name,
        message: errorResponse.message,
        url: error.url,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Error no estructurado (network, etc.)
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
