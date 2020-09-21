import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServeOrderItemComponent } from './serve-order-item.component';

describe('ServeOrderItemComponent', () => {
  let component: ServeOrderItemComponent;
  let fixture: ComponentFixture<ServeOrderItemComponent>;

  beforeEach(async(() => {
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
