import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcTopBarComponent } from './ac-top-bar.component';

describe('AcTopBarComponent', () => {
  let component: AcTopBarComponent;
  let fixture: ComponentFixture<AcTopBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcTopBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcTopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
