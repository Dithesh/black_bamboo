import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInventoryManagerComponent } from './update-inventory-manager.component';

describe('UpdateInventoryManagerComponent', () => {
  let component: UpdateInventoryManagerComponent;
  let fixture: ComponentFixture<UpdateInventoryManagerComponent>;

  beforeEach(async(() => {
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
