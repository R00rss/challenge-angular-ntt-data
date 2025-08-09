import { Inject, Injectable } from '@angular/core';
import {
  ProductRepository,
  ProductRepositoryToken,
} from '../../domain/repositories/product-repository';
import { ProductQuery } from '../../domain/value-objects/product-query';

@Injectable()
export class FilterProductsUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository
  ) {}

  execute(query: ProductQuery) {
    return this.productRepository.findByQuery(query);
  }
}
