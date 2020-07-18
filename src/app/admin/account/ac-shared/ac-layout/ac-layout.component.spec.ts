import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcLayoutComponent } from './ac-layout.component';

describe('AcLayoutComponent', () => {
  let component: AcLayoutComponent;
  let fixture: ComponentFixture<AcLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
