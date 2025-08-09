import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductModalDelete } from './product-modal-delete';

describe('ProductModalDelete', () => {
  let component: ProductModalDelete;
  let fixture: ComponentFixture<ProductModalDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductModalDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductModalDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
