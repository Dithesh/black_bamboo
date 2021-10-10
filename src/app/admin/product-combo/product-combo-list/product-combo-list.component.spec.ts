import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComboListComponent } from './product-combo-list.component';

describe('ProductComboListComponent', () => {
  let component: ProductComboListComponent;
  let fixture: ComponentFixture<ProductComboListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComboListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComboListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
