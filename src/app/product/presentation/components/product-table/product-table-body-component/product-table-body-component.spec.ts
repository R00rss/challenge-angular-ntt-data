import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableBodyComponent } from './product-table-body-component';

describe('ProductTableBodyComponent', () => {
  let component: ProductTableBodyComponent;
  let fixture: ComponentFixture<ProductTableBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableBodyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTableBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
