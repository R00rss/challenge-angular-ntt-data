import { Inject, Injectable } from '@angular/core';
import {
  ProductRepository,
  ProductRepositoryToken,
} from '../../domain/repositories/product-repository';

@Injectable()
export class DeleteProductsUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository
  ) {}

  execute(productId: string) {
    return this.productRepository.delete(productId);
  }
}
