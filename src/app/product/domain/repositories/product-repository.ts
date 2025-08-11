import ProductEntity from '../entities/product.entity';
import { Injectable, InjectionToken } from '@angular/core';
import { BaseRepository } from '@/app/core/domain/repository/base-repository';
import { ProductQuery } from '../value-objects/product-query';

@Injectable({ providedIn: 'root' })
export abstract class ProductRepository extends BaseRepository<
  ProductEntity,
  string,
  ProductQuery
> {}
