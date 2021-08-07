import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrderItemComponent } from './add-order-item.component';

describe('AddOrderItemComponent', () => {
  let component: AddOrderItemComponent;
  let fixture: ComponentFixture<AddOrderItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
