import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderReportComponent } from './order-report.component';

describe('OrderReportComponent', () => {
  let component: OrderReportComponent;
  let fixture: ComponentFixture<OrderReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
