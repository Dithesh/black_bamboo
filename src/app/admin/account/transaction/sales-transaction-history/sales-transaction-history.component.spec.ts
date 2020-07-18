import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTransactionHistoryComponent } from './sales-transaction-history.component';

describe('SalesTransactionHistoryComponent', () => {
  let component: SalesTransactionHistoryComponent;
  let fixture: ComponentFixture<SalesTransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesTransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
