import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrderTypeComponent } from './add-order-type.component';

describe('AddOrderTypeComponent', () => {
  let component: AddOrderTypeComponent;
  let fixture: ComponentFixture<AddOrderTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
