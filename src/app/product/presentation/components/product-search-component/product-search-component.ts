import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'product-search-component',
  imports: [],
  templateUrl: './product-search-component.html',
  styleUrl: './product-search-component.css',
})
export class ProductSearchComponent {
  @Output() searchChange = new EventEmitter<string>();

  // onSearchTermChange(newTerm: string) {
  //   this.searchTermChange.emit(newTerm);
  // }
}
