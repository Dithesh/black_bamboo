import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryStockUpdateComponent } from './inventory-stock-update.component';

describe('InventoryStockUpdateComponent', () => {
  let component: InventoryStockUpdateComponent;
  let fixture: ComponentFixture<InventoryStockUpdateComponent>;

  beforeEach(async(() => {
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
