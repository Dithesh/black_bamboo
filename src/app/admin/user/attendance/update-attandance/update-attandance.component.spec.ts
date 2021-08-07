import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateAttandanceComponent } from './update-attandance.component';

describe('UpdateAttandanceComponent', () => {
  let component: UpdateAttandanceComponent;
  let fixture: ComponentFixture<UpdateAttandanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAttandanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAttandanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
