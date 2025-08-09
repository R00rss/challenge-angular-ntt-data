import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import ProductEntity from '../../domain/entities/product.entity';
import { FilterProductsUseCase } from '../use-cases/filter-products.use-case';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { Router } from '@angular/router';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { EditProductUseCase } from '../use-cases/edit-product.use-case';
import { DeleteProductsUseCase } from '../use-cases/delete-product.use-case';

export type OptionProductClick = {
  operation: string;
  product: ProductEntity;
};

type ProductServiceState = {
  paginatedProducts: PaginatedResult<ProductEntity> | null;
  message: string | null;
  loading: boolean;
  error: string | null;
  //TODO: this should be on its own service
  //TODO: do it this way to save time

  isModalDeleteOpen: boolean;
  selectedProductToDelete: ProductEntity | null;
};

const initialState: ProductServiceState = {
  // states for product use cases
  paginatedProducts: null,
  message: null,
  loading: false,
  error: null,

  isModalDeleteOpen: false,
  selectedProductToDelete: null,
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _state = new BehaviorSubject<ProductServiceState>(initialState);

  readonly state$ = this._state.asObservable();
  readonly paginatedProducts$ = this.state$.pipe(
    map((s) => s.paginatedProducts)
  );
  readonly loading$ = this.state$.pipe(map((s) => s.loading));
  readonly error$ = this.state$.pipe(map((s) => s.error));
  readonly message$ = this.state$.pipe(map((s) => s.message));
  readonly selectedProductToDelete$ = this.state$.pipe(
    map((s) => s.selectedProductToDelete)
  );

  constructor(
    private filterProductsUseCase: FilterProductsUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: EditProductUseCase,
    private deleteProductUseCase: DeleteProductsUseCase,
    private router: Router
  ) {}

  private updateState(changes: Partial<typeof this._state.value>): void {
    const currentState = this._state.value;
    this._state.next({ ...currentState, ...changes });
  }

  cancelModalDelete(): void {
    this.updateState({
      isModalDeleteOpen: false,
      selectedProductToDelete: null,
    });
  }

  openModalDelete(product: ProductEntity): void {
    this.updateState({
      isModalDeleteOpen: true,
      selectedProductToDelete: product,
    });
  }

  confirmDeleteProduct(): void {
    const product = this._state.value.selectedProductToDelete;
    if (product) {
      this.updateState({
        isModalDeleteOpen: false,
        selectedProductToDelete: null,
      });
      this.deleteProductUseCase.execute(product.id).subscribe({
        next: () => {
          console.log('Product deleted:', product);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
        complete: () => {
          this.loadProducts();
        },
      });
    }
  }

  onOptionProductClick({ operation, product }: OptionProductClick) {
    switch (operation) {
      case 'edit':
        const url = `/products/edit/${product.id}`;
        this.router.navigateByUrl(url);
        break;
      case 'delete':
        this.openModalDelete(product);
        break;
    }
  }

  changeFilter(searchTerm: string): void {
    const query = ProductQuery.create({ searchTerm });
    this.loadProducts(query);
  }

  changePageSize(pageSize: number): void {
    const query = ProductQuery.create({ pageSize });
    this.loadProducts(query);
  }

  async loadProducts(
    productQuery: ProductQuery = new ProductQuery()
  ): Promise<void> {
    this.updateState({ loading: true, error: null });
    try {
      this.filterProductsUseCase.execute(productQuery).subscribe({
        next: (result) => {
          if ('message' in result) {
            this.updateState({
              paginatedProducts: result.data,
              message: result.message,
              loading: false,
              error: null,
            });
          } else {
            this.updateState({
              paginatedProducts: result,
              message: null,
              loading: false,
              error: null,
            });
          }
        },
        error: (error) => {
          this.updateState({ loading: false, error: error.message });
        },
      });
    } catch (error) {
      this.updateState({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
