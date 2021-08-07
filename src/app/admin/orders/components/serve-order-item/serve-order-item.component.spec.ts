import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServeOrderItemComponent } from './serve-order-item.component';

describe('ServeOrderItemComponent', () => {
  let component: ServeOrderItemComponent;
  let fixture: ComponentFixture<ServeOrderItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServeOrderItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServeOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
