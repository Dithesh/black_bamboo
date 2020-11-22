import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerManagerComponent } from './ledger-manager.component';

describe('LedgerManagerComponent', () => {
  let component: LedgerManagerComponent;
  let fixture: ComponentFixture<LedgerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedgerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
