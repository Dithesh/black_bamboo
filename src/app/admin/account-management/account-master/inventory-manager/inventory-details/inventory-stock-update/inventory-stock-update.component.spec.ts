import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InventoryStockUpdateComponent } from './inventory-stock-update.component';

describe('InventoryStockUpdateComponent', () => {
  let component: InventoryStockUpdateComponent;
  let fixture: ComponentFixture<InventoryStockUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryStockUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryStockUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
