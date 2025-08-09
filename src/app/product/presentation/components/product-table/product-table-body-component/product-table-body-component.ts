import ProductEntity from '@/app/product/domain/entities/product.entity';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThreeDotsIconComponent } from '@/app/core/presentation/icon/three-dots-icon-component/three-dots-icon-component';
import { Router } from '@angular/router';
import { OptionProductClick } from '@/app/product/application/services/product-service';

@Component({
  selector: 'product-table-body-component',
  imports: [DatePipe, ThreeDotsIconComponent],
  templateUrl: './product-table-body-component.html',
  styleUrl: './product-table-body-component.css',
})
export class ProductTableBodyComponent {
  @Input() products!: ProductEntity[];
  @Input() options!: { label: string; operation: string }[];
  @Output() onOptionClick = new EventEmitter<OptionProductClick>();

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  handleOptionClick(operation: string, product: ProductEntity): void {
    this.onOptionClick.emit({
      operation,
      product,
    });
    this.closeDropdown();
  }
}
