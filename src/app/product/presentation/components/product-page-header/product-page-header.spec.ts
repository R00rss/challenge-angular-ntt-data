import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageHeader } from './product-page-header';

describe('ProductPageHeader', () => {
  let component: ProductPageHeader;
  let fixture: ComponentFixture<ProductPageHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPageHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPageHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
