import { Inject, Injectable } from '@angular/core';
import {
  ProductRepository,
  ProductRepositoryToken,
} from '../../domain/repositories/product-repository';
import ProductEntity from '../../domain/entities/product.entity';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductRepositoryToken)
    private readonly productRepository: ProductRepository
  ) {}

  execute(product: ProductEntity) {
    return this.productRepository.create(product);
  }
}
