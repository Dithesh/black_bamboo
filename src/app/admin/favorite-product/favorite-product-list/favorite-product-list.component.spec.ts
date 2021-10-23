import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteProductListComponent } from './favorite-product-list.component';

describe('FavoriteProductListComponent', () => {
  let component: FavoriteProductListComponent;
  let fixture: ComponentFixture<FavoriteProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
