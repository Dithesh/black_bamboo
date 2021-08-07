import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsolidatedKitchenComponent } from './consolidated-kitchen.component';

describe('ConsolidatedKitchenComponent', () => {
  let component: ConsolidatedKitchenComponent;
  let fixture: ComponentFixture<ConsolidatedKitchenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsolidatedKitchenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
