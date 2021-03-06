import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOrderInvoiceComponent } from './print-order-invoice.component';

describe('PrintOrderInvoiceComponent', () => {
  let component: PrintOrderInvoiceComponent;
  let fixture: ComponentFixture<PrintOrderInvoiceComponent>;

  beforeEach(async(() => {
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
