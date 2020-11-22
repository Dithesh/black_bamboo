import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingsManagerComponent } from './account-settings-manager.component';

describe('AccountSettingsManagerComponent', () => {
  let component: AccountSettingsManagerComponent;
  let fixture: ComponentFixture<AccountSettingsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
