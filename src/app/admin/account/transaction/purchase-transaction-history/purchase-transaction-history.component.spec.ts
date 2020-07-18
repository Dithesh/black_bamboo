import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTransactionHistoryComponent } from './purchase-transaction-history.component';

describe('PurchaseTransactionHistoryComponent', () => {
  let component: PurchaseTransactionHistoryComponent;
  let fixture: ComponentFixture<PurchaseTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
