import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing-module';
import HttpProductRepository from '@/app/product/infrastructure/repositories/product-repository.implementation';
import { ProductRepositoryToken } from '@/app/product/domain/repositories/product-repository';
import { FilterProductsUseCase } from './application/use-cases/filter-products.use-case';
import { ProductService } from './application/services/product-service';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { EditProductUseCase } from './application/use-cases/edit-product.use-case';
import { DeleteProductsUseCase } from './application/use-cases/delete-product.use-case';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductRoutingModule],
  providers: [
    {
      provide: ProductRepositoryToken,
      useClass: HttpProductRepository,
    },
    FilterProductsUseCase,
    CreateProductUseCase,
    EditProductUseCase,
    DeleteProductsUseCase,
    ProductService,
  ],
})
export class ProductModule {}
