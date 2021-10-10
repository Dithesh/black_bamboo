import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboUpdateComponent } from './product-combo-update.component';

describe('ProductComboUpdateComponent', () => {
  let component: ProductComboUpdateComponent;
  let fixture: ComponentFixture<ProductComboUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComboUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
