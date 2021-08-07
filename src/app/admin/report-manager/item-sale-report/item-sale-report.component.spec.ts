import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemSaleReportComponent } from './item-sale-report.component';

describe('ItemSaleReportComponent', () => {
  let component: ItemSaleReportComponent;
  let fixture: ComponentFixture<ItemSaleReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSaleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
