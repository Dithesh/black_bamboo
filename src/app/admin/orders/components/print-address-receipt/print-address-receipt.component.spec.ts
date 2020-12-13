import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAddressReceiptComponent } from './print-address-receipt.component';

describe('PrintAddressReceiptComponent', () => {
  let component: PrintAddressReceiptComponent;
  let fixture: ComponentFixture<PrintAddressReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAddressReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAddressReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
