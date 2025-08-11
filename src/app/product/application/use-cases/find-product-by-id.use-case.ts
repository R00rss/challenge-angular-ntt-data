import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product-repository';

@Injectable()
export class FindProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(productId: string) {
    return this.productRepository.findById(productId);
  }
}
