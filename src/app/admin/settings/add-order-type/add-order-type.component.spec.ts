import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderTypeComponent } from './add-order-type.component';

describe('AddOrderTypeComponent', () => {
  let component: AddOrderTypeComponent;
  let fixture: ComponentFixture<AddOrderTypeComponent>;

  beforeEach(async(() => {
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
