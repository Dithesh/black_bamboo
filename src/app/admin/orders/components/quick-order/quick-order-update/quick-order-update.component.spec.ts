import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOrderUpdateComponent } from './quick-order-update.component';

describe('QuickOrderUpdateComponent', () => {
  let component: QuickOrderUpdateComponent;
  let fixture: ComponentFixture<QuickOrderUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickOrderUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOrderUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
