import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountMasterComponent } from './account-master.component';

describe('AccountMasterComponent', () => {
  let component: AccountMasterComponent;
  let fixture: ComponentFixture<AccountMasterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
