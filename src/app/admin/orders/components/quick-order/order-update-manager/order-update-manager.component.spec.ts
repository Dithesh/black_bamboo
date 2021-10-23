import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpdateManagerComponent } from './order-update-manager.component';

describe('OrderUpdateManagerComponent', () => {
  let component: OrderUpdateManagerComponent;
  let fixture: ComponentFixture<OrderUpdateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderUpdateManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpdateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
