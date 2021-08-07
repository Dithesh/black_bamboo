import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateBranchComponent } from './update-branch.component';

describe('UpdateBranchComponent', () => {
  let component: UpdateBranchComponent;
  let fixture: ComponentFixture<UpdateBranchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
