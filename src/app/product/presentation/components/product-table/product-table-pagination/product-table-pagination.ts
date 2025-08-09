import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'product-table-pagination',
  imports: [],
  templateUrl: './product-table-pagination.html',
  styleUrl: './product-table-pagination.css',
})
export class ProductTablePagination {
  @Input() totalItems!: number;
  @Input() pageSize!: number;
  @Output() onPageSizeChange = new EventEmitter<number>();

  isDropdownOpen = false;
  pageSizeOptions = [5, 10, 15, 20, 25, 50];

  handlePageSizeChange(size: number): void {
    this.pageSize = size;
    this.isDropdownOpen = false;
    this.onPageSizeChange.emit(size);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
