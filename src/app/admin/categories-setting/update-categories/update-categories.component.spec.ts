import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateCategoriesComponent } from './update-categories.component';

describe('UpdateCategoriesComponent', () => {
  let component: UpdateCategoriesComponent;
  let fixture: ComponentFixture<UpdateCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
