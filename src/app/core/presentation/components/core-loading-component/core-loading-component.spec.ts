import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreLoadingComponent } from './core-loading-component';

describe('CoreLoadingComponent', () => {
  let component: CoreLoadingComponent;
  let fixture: ComponentFixture<CoreLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
