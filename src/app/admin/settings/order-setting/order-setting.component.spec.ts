import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderSettingComponent } from './order-setting.component';

describe('OrderSettingComponent', () => {
  let component: OrderSettingComponent;
  let fixture: ComponentFixture<OrderSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
