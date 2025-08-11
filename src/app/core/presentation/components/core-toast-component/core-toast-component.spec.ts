import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreToastComponent } from './core-toast-component';

describe('CoreToastComponent', () => {
  let component: CoreToastComponent;
  let fixture: ComponentFixture<CoreToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
