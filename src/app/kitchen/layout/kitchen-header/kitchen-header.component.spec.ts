import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KitchenHeaderComponent } from './kitchen-header.component';

describe('KitchenHeaderComponent', () => {
  let component: KitchenHeaderComponent;
  let fixture: ComponentFixture<KitchenHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
