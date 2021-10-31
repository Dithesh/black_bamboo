import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-order-item-add',
  templateUrl: './order-item-add.component.html',
  styleUrls: ['./order-item-add.component.scss']
})
export class OrderItemAddComponent implements OnInit, OnDestroy {
  @ViewChild('description') description: ElementRef;
  product;
  keyListener = this.shortCutKeyHandler.bind(this);
  advancedPricigArray: any[] = [];
  descriptionControl: FormControl = new FormControl('');
  priceControl: FormControl = new FormControl('');
  selectedOrderType: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<OrderItemAddComponent>
  ) {
    this.product = data.item;
    this.selectedOrderType = data.selectedOrderType;
    this.priceControl.setValue(this.product.price);
    this.advancedPricigArray = this.product.advanced_pricing.map(elem => elem.id);
  }

  ngOnInit(): void {
    window.addEventListener('keydown', this.keyListener, true);
  }




  shortCutKeyHandler(e) {
    if (e.code === 'ArrowRight') {
      e.preventDefault();
      this.handleOrderQuantityInput(this.product, 'next');
    }else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      this.handleOrderQuantityInput(this.product, 'prev');
    }else if (e.code === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = this.advancedPricigArray.indexOf(this.product.advancedPriceId);
      if (currentIndex > 0) {
        this.product.advancedPriceId = this.advancedPricigArray[currentIndex - 1];
      }
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = this.advancedPricigArray.indexOf(this.product.advancedPriceId);
      if (currentIndex < this.advancedPricigArray.length - 1) {
        this.product.advancedPriceId = this.advancedPricigArray[currentIndex + 1];
      }
    }  else if ((e.shiftKey && e.code === 'Enter') || (e.shiftKey && e.code === 'NumpadEnter')) {
      e.preventDefault();
      this.descriptionControl.setValue(this.descriptionControl.value + '\n');
    }  else if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      e.preventDefault();
      this.saveItem();
    } else if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      if (this.selectedOrderType.tableRequired) {
        this.product.isParcel = !this.product.isParcel;
      }
    } else if (e.ctrlKey && e.code === 'KeyX') {
      e.preventDefault();
      this.dialogRef.close();
    }
  }

  saveItem() {
    const price = parseFloat(this.priceControl.value);
    if (isNaN(price) || price < 0) {
      this.priceControl.setErrors({invalid: 'Please enter valid price'});
      return;
    }
    this.dialogRef.close({
      ...this.product,
      price,
      itemDescription: this.descriptionControl.value
    });
  }
  close() {
    this.dialogRef.close();
  }

  handleOrderQuantityInput(item, type) {
    let current = item.quantity;
    if (type === 'next') {
      current++;
    } else if (type === 'prev') {
      current--;
    }

    if (current <= 0) {
      current = 1;
    }
    item.quantity = current;
  }


  handleProductPriceChange() {
    this.product.advanced_pricing.forEach(elem => {
      if (elem.id === this.product.advancedPriceId) {
        this.product.price = elem.price;
        this.priceControl.setValue(this.product.price);
        this.product.advancedPriceTitle = elem.title;
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keyListener, true);
  }

}
