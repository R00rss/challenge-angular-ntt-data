import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTablePagination } from './product-table-pagination';

describe('ProductTablePagination', () => {
  let component: ProductTablePagination;
  let fixture: ComponentFixture<ProductTablePagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTablePagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTablePagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
