import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InventoryManagerComponent } from './inventory-manager.component';

describe('InventoryManagerComponent', () => {
  let component: InventoryManagerComponent;
  let fixture: ComponentFixture<InventoryManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
