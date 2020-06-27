import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeAwayPageComponent } from './take-away-page.component';

describe('TakeAwayPageComponent', () => {
  let component: TakeAwayPageComponent;
  let fixture: ComponentFixture<TakeAwayPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeAwayPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeAwayPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
