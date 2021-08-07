import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableSelectionComponent } from './table-selection.component';

describe('TableSelectionComponent', () => {
  let component: TableSelectionComponent;
  let fixture: ComponentFixture<TableSelectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
