import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransactionHistoryComponent } from './payment-transaction-history.component';

describe('PaymentTransactionHistoryComponent', () => {
  let component: PaymentTransactionHistoryComponent;
  let fixture: ComponentFixture<PaymentTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
