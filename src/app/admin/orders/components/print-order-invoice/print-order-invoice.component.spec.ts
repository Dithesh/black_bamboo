import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrintOrderInvoiceComponent } from './print-order-invoice.component';

describe('PrintOrderInvoiceComponent', () => {
  let component: PrintOrderInvoiceComponent;
  let fixture: ComponentFixture<PrintOrderInvoiceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintOrderInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOrderInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
