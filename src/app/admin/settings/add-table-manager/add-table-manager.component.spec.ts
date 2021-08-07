import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddTableManagerComponent } from './add-table-manager.component';

describe('AddTableManagerComponent', () => {
  let component: AddTableManagerComponent;
  let fixture: ComponentFixture<AddTableManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTableManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTableManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
