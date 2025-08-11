import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { ProductForm } from '../../components/product-form/product-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';

@Component({
  selector: 'product-edit-page',
  imports: [PageLayoutComponent, ProductForm],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.css',
})
export class ProductEditPage implements OnInit {
  selectedProductId: string = '';
  fondedProduct: ProductEntity | null = null;
  loadingProduct = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.validateEditMode();
  }

  validateEditMode(): void {
    this.selectedProductId = this.route.snapshot.paramMap.get('id') ?? '';
    this.productService.findProductById(this.selectedProductId).subscribe({
      next: (product) => {
        this.fondedProduct = product;
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Hubo un error al buscar el producto',
          type: NotificationType.Error,
        };
        this.errorMessage = 'Hubo un error al buscar el producto';
        this.notificationService.show(notificationOptions);
      },
      complete: () => {
        this.loadingProduct = false;
      },
    });
  }

  onSubmitForm(editedProduct: ProductEntity): void {
    this.productService.updateProduct(editedProduct);
  }
}
