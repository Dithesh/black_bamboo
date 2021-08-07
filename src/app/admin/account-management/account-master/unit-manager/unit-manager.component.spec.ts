import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnitManagerComponent } from './unit-manager.component';

describe('UnitManagerComponent', () => {
  let component: UnitManagerComponent;
  let fixture: ComponentFixture<UnitManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
