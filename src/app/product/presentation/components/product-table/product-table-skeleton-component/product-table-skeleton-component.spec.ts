import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableSkeletonComponent } from './product-table-skeleton-component';

describe('ProductTableSkeletonComponent', () => {
  let component: ProductTableSkeletonComponent;
  let fixture: ComponentFixture<ProductTableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
