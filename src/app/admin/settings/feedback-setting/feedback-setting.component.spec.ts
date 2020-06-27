import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSettingComponent } from './feedback-setting.component';

describe('FeedbackSettingComponent', () => {
  let component: FeedbackSettingComponent;
  let fixture: ComponentFixture<FeedbackSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
