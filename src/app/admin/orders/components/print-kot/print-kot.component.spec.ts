import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintKotComponent } from './print-kot.component';

describe('PrintKotComponent', () => {
  let component: PrintKotComponent;
  let fixture: ComponentFixture<PrintKotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintKotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintKotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
