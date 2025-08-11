import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component } from '@angular/core';
import { ProductTableBodyComponent } from '../product-table-body-component/product-table-body-component';
import { ProductTableHeaderComponent } from '../product-table-header-component/product-table-header-component';
import { ProductTablePagination } from '../product-table-pagination/product-table-pagination';
import {
  OptionProductClick,
  ProductService,
} from '@/app/product/application/services/product-service';
import { ProductTableSkeletonComponent } from '../product-table-skeleton-component/product-table-skeleton-component';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_TOTAL_ITEMS = 5;

@Component({
  selector: 'product-table-component',
  imports: [
    ProductTableBodyComponent,
    ProductTableHeaderComponent,
    ProductTablePagination,
    ProductTableSkeletonComponent,
  ],
  templateUrl: './product-table-component.html',
  styleUrl: './product-table-component.css',
})
export class ProductTableComponent {
  constructor(private productService: ProductService) {
    this.productService.paginatedProducts$.subscribe((products) => {
      this.products = products?.items ?? [];
      this.totalItems = products?.totalItems ?? DEFAULT_TOTAL_ITEMS;
      this.pageSize = products?.pagination.pageSize ?? DEFAULT_PAGE_SIZE;
      this.thereAreNotProducts = this.products.length === 0;
    });

    this.productService.isLoadingProducts$.subscribe((isLoading) => {
      this.isLoadingProducts = isLoading;
    });
  }

  isLoadingProducts = true;
  thereAreNotProducts = false;

  products: ProductEntity[] = [];
  totalItems: number = DEFAULT_TOTAL_ITEMS;
  pageSize: number = DEFAULT_PAGE_SIZE;

  options = [
    {
      label: 'Edit',
      operation: 'edit',
    },
    {
      label: 'Eliminar',
      operation: 'delete',
    },
  ];

  handleOptionClick(params: OptionProductClick) {
    this.productService.onOptionProductClick(params);
  }

  handlePageSizeChange(size: number) {
    this.productService.changePageSize(size);
  }
}
