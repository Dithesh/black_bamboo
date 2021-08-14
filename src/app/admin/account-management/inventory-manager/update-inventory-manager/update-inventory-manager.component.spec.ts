import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateInventoryManagerComponent } from './update-inventory-manager.component';

describe('UpdateInventoryManagerComponent', () => {
  let component: UpdateInventoryManagerComponent;
  let fixture: ComponentFixture<UpdateInventoryManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateInventoryManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateInventoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
