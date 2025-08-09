import ProductEntity from '../entities/product.entity';
import { InjectionToken } from '@angular/core';
import { BaseRepository } from '@/app/core/domain/repository/base-repository';
import { ProductQuery } from '../value-objects/product-query';

type base = BaseRepository<ProductEntity, string, ProductQuery>;
export interface ProductRepository extends base {}
export const ProductRepositoryToken = InjectionToken<ProductRepository>;
