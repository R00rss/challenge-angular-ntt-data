import { Component } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';

@Component({
  selector: 'app-product-create-page',
  imports: [PageLayoutComponent, ProductForm],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.css',
})
export class ProductCreatePage {
  constructor(private readonly productService: ProductService) {}

  onSubmitForm(newProduct: ProductEntity): void {
    this.productService.createProduct(newProduct);
  }
}
