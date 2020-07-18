import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptTransactionComponent } from './receipt-transaction.component';

describe('ReceiptTransactionComponent', () => {
  let component: ReceiptTransactionComponent;
  let fixture: ComponentFixture<ReceiptTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
