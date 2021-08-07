import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoriesSettingComponent } from './categories-setting.component';

describe('CategoriesSettingComponent', () => {
  let component: CategoriesSettingComponent;
  let fixture: ComponentFixture<CategoriesSettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
