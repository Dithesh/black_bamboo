import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderListsComponent } from './order-lists.component';

describe('OrderListsComponent', () => {
  let component: OrderListsComponent;
  let fixture: ComponentFixture<OrderListsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
