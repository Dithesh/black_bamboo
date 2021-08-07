import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewReceiptComponent } from './new-receipt.component';

describe('NewReceiptComponent', () => {
  let component: NewReceiptComponent;
  let fixture: ComponentFixture<NewReceiptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
