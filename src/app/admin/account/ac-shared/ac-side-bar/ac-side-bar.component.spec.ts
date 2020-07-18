import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcSideBarComponent } from './ac-side-bar.component';

describe('AcSideBarComponent', () => {
  let component: AcSideBarComponent;
  let fixture: ComponentFixture<AcSideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcSideBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
