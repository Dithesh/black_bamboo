import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableSetupComponent } from './table-setup.component';

describe('TableSetupComponent', () => {
  let component: TableSetupComponent;
  let fixture: ComponentFixture<TableSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
