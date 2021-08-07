import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountSettingsManagerComponent } from './account-settings-manager.component';

describe('AccountSettingsManagerComponent', () => {
  let component: AccountSettingsManagerComponent;
  let fixture: ComponentFixture<AccountSettingsManagerComponent>;

  beforeEach(waitForAsync(() => {
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
