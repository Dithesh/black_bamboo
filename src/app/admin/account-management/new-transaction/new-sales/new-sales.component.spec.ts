import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewSalesComponent } from './new-sales.component';

describe('NewSalesComponent', () => {
  let component: NewSalesComponent;
  let fixture: ComponentFixture<NewSalesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
