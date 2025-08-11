import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, delay, map, Observable, of } from 'rxjs';
import ProductEntity from '../../domain/entities/product.entity';
import { FilterProductsUseCase } from '../use-cases/filter-products.use-case';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { Router } from '@angular/router';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { EditProductUseCase } from '../use-cases/edit-product.use-case';
import { DeleteProductsUseCase } from '../use-cases/delete-product.use-case';
import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { VerifyProductExistsUseCase } from '../use-cases/verify-product-exists.use-case';
import { LoadingService } from '@/app/core/application/services/loading/loading-service';
import { FindProductByIdUseCase } from '../use-cases/find-product-by-id.use-case';

export type OptionProductClick = {
  operation: string;
  product: ProductEntity;
};

type ProductServiceState = {
  paginatedProducts: PaginatedResult<ProductEntity> | null;
  messageLoadingProducts: string | null;
  isLoadingProducts: boolean;
  errorLoadingProducts: string | null;
  //TODO: this should be on its own service
  //TODO: do it this way to save time

  isModalDeleteOpen: boolean;
  selectedProductToDelete: ProductEntity | null;
};

const initialState: ProductServiceState = {
  // states for product use cases
  paginatedProducts: null,
  messageLoadingProducts: null,
  isLoadingProducts: false,
  errorLoadingProducts: null,

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
  readonly isLoadingProducts$ = this.state$.pipe(
    map((s) => s.isLoadingProducts)
  );
  readonly errorLoadingProducts$ = this.state$.pipe(
    map((s) => s.errorLoadingProducts)
  );
  readonly messageLoadingProducts$ = this.state$.pipe(
    map((s) => s.messageLoadingProducts)
  );
  readonly selectedProductToDelete$ = this.state$.pipe(
    map((s) => s.selectedProductToDelete)
  );

  constructor(
    private filterProductsUseCase: FilterProductsUseCase,
    private findProductByIdUseCase: FindProductByIdUseCase,
    private createProductUseCase: CreateProductUseCase,
    private updateProductUseCase: EditProductUseCase,
    private deleteProductUseCase: DeleteProductsUseCase,
    private verifyProductExistsUseCase: VerifyProductExistsUseCase,
    private readonly notificationService: NotificationService,
    private readonly loadingService: LoadingService,
    private router: Router
  ) {}

  private updateState(changes: Partial<typeof this._state.value>): void {
    const currentState = this._state.value;
    this._state.next({ ...currentState, ...changes });
  }

  checkProductExists(productId: string) {
    return this.verifyProductExistsUseCase.execute(productId).pipe(
      map((result) => {
        if (typeof result === 'object') {
          return result.data;
        } else {
          return result;
        }
      }),
      catchError((error) => {
        console.error('Error al verificar la existencia del producto:', error);
        return of(false);
      })
    );
  }

  createProduct(product: ProductEntity) {
    this.loadingService.block();
    return this.createProductUseCase.execute(product).subscribe({
      next: (result) => {
        const notificationOptions = {
          message: 'Producto creado exitosamente',
          type: NotificationType.Success,
        };
        this.notificationService.show(notificationOptions);
        const url = `/products`;
        this.router.navigateByUrl(url);
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al crear el producto',
          type: NotificationType.Error,
        };
        this.notificationService.show(notificationOptions);
        this.loadingService.unblock();
      },
      complete: () => {
        this.loadingService.unblock();
      },
    });
  }

  updateProduct(product: ProductEntity) {
    this.loadingService.block();
    return this.updateProductUseCase.execute(product).subscribe({
      next: (result) => {
        const notificationOptions = {
          message: 'Producto editado exitosamente',
          type: NotificationType.Success,
        };
        this.notificationService.show(notificationOptions);
        const url = `/products`;
        this.router.navigateByUrl(url);
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al editar el producto',
          type: NotificationType.Error,
        };
        this.notificationService.show(notificationOptions);
        this.loadingService.unblock();
      },
      complete: () => {
        this.loadingService.unblock();
      },
    });
  }

  findProductById(productId: string): Observable<ProductEntity | null> {
    this.loadingService.block();
    return this.findProductByIdUseCase.execute(productId).pipe(
      delay(2000),
      map((result) => {
        this.loadingService.unblock();
        return result;
      }),
      catchError((error) => {
        console.error('Error al buscar el producto por ID:', error);
        this.loadingService.unblock();
        return of(null);
      })
    );
  }

  openModalDelete(product: ProductEntity): void {
    this.updateState({
      isModalDeleteOpen: true,
      selectedProductToDelete: product,
    });
  }

  cancelModalDelete(): void {
    this.updateState({
      isModalDeleteOpen: false,
      selectedProductToDelete: null,
    });
    const notificationOptions = {
      message: 'Se cancelo la acción',
      type: NotificationType.Info,
    };

    this.notificationService.show(notificationOptions);
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
          const notificationOptions = {
            message: 'Se eliminó el producto',
            type: NotificationType.Success,
          };

          this.notificationService.show(notificationOptions);
        },
        error: (error) => {
          const notificationOptions = {
            message: 'Error al eliminar el producto',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
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
    this.updateState({ isLoadingProducts: true, errorLoadingProducts: null });
    try {
      this.filterProductsUseCase.execute(productQuery).subscribe({
        next: (result) => {
          if ('message' in result) {
            this.updateState({
              paginatedProducts: result.data,
              messageLoadingProducts: result.message,
              isLoadingProducts: false,
              errorLoadingProducts: null,
            });
          } else {
            this.updateState({
              paginatedProducts: result,
              messageLoadingProducts: null,
              isLoadingProducts: false,
              errorLoadingProducts: null,
            });
          }
        },
        error: (error) => {
          this.updateState({
            isLoadingProducts: false,
            errorLoadingProducts: error.message,
          });
        },
      });
    } catch (error) {
      this.updateState({
        isLoadingProducts: false,
        errorLoadingProducts:
          error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
