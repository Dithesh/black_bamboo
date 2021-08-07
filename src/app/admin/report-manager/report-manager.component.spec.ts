import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportManagerComponent } from './report-manager.component';

describe('ReportManagerComponent', () => {
  let component: ReportManagerComponent;
  let fixture: ComponentFixture<ReportManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
