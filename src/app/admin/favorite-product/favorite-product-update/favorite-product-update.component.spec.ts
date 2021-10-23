import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteProductUpdateComponent } from './favorite-product-update.component';

describe('FavoriteProductUpdateComponent', () => {
  let component: FavoriteProductUpdateComponent;
  let fixture: ComponentFixture<FavoriteProductUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteProductUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteProductUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
