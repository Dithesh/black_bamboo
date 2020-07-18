import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTransactionHistoryComponent } from './receipt-transaction-history.component';

describe('ReceiptTransactionHistoryComponent', () => {
  let component: ReceiptTransactionHistoryComponent;
  let fixture: ComponentFixture<ReceiptTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
