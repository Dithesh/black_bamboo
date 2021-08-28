import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableUpdateComponent } from './table-update.component';

describe('TableUpdateComponent', () => {
  let component: TableUpdateComponent;
  let fixture: ComponentFixture<TableUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
