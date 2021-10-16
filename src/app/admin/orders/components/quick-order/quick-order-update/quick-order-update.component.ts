import {Component, Inject, OnInit} from '@angular/core';
import {NewOrderComponent} from "../../new-order/new-order.component";
import {FormArray, FormBuilder} from "@angular/forms";
import {DataService} from "../../../../../shared/services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmPopupComponent} from "../../../../../shared/components/confirm-popup/confirm-popup.component";

@Component({
  selector: 'app-quick-order-update',
  templateUrl: './quick-order-update.component.html',
  styleUrls: ['./quick-order-update.component.scss']
})
export class QuickOrderUpdateComponent extends NewOrderComponent implements OnInit {

  constructor(
    protected fb: FormBuilder,
    protected _serv: DataService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) protected data,
    private dialogRef: MatDialogRef<QuickOrderUpdateComponent>
  ) {
    super(
      fb,
      _serv,
      route,
      router,
      dialog
    );
    super.accessType = 'dialog';
    if (this.data) {
      this.orderId = this.data.orderId;
    }
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.data.itemSavedType === 'unsaved') {
      this.patchPreviousData(this.data.unsavedData);
    }else {
      this.getTableInfo();
    }
  }

  patchPreviousData(data) {
      this.form.patchValue(data);

      if (data.orderStatus === 'completed' || data.orderStatus === 'cancelled' || data.rejectedCount > 0 || this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin') {
        this.blockForms = true;
        this.form.disable();
      } else {
        this.blockForms = false;
        this.form.enable();
      }

      this.items.controls = [];
      this.items.reset();
      data.items.forEach(item => {

        const orderItem = this.addOrderItem();
        if (this.blockForms === true) { orderItem.disable(); }
        orderItem.patchValue(item);
        this.items.push(orderItem);
        this.getOrderItemTotal(orderItem);
      });


      this.comboItems.controls = [];
      this.comboItems.reset();
      data.comboItems.forEach(item => {

        const comboItem = this.addOrderItemCombo();
        if (this.blockForms === true) { comboItem.disable(); }
        comboItem.patchValue(item);
        this.comboItems.push(comboItem);
        this.getOrderItemComboTotal(comboItem);
      });

      this.getBranchDetail(data.branch_id);
      this.handleFinalPricing();
      this.getTableInfo(() => {
        this.tables.controls.forEach(control => {
          data.tables.forEach(elem => {
            if (control.get('id').value === elem.id) {
              (control.get('chairs') as FormArray).controls.forEach(chair => {
                if (elem.chairs.indexOf(chair.get('chairId').value) >= 0) {
                  chair.get('isSelected').setValue(true);
                }
              });
            }
          });
        });
      });
  }


  shortCutKeyHandler(e) {
    if (!this.blockForms) {
      if (e.code === 'F1') {
        e.preventDefault();
        this.searchInput.nativeElement.focus();
      }else if (e.ctrlKey && e.code === 'KeyD') {
        e.preventDefault();
        this.form.get('taxDisabled').setValue(!this.form.get('taxDisabled').value);
        this.handleFinalPricing();
      } else if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        this.saveOrder('confirm', this.handlePopupClose.bind(this));
      } else if (e.ctrlKey && e.code === 'KeyQ') {
        e.preventDefault();
        const billIndex = this.selectedOrderType.tableRequired ? 4 : 3;
        if(this.tabGroup.selectedIndex !== billIndex) {
          this.tabGroup.selectedIndex = billIndex;
        }else {
          this.saveOrder('complete', this.handlePopupClose.bind(this));
        }
        // this.saveOrder('complete');
      } else if ((e.ctrlKey && e.code === 'KeyN') || e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        const openNew = (e.code === 'KeyN') ? true : false;

        if (this.items.length > 0 || this.comboItems.length > 0) {
            if (this._serv.notNull(this.form.get('id').value)) {
              if (this.isDirty) {
                const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                  data: {
                    message: 'Order data is updated. Do you want to save'
                  }
                });
                dialogRef.afterClosed().subscribe(data => {
                  if (data) {
                    this.saveOrder('confirm', () => {
                      this.dialogRef.close({
                        openNew
                      });
                    });
                  }else {
                    this.dialogRef.close({
                      openNew
                    });
                  }
                });
              }else {
                this.dialogRef.close({
                  openNew
                });
              }
            }else {
              this.unsavedDataUpdateAndClose(openNew);
            }
        }else if(e.code === 'Escape') {
          this.dialogRef.close();
        }
      } else if (e.ctrlKey && e.code === 'KeyK') {
        this.saveOrder('confirm', () => {
          this.printAddress();
          this.dialogRef.close();
        });
        // this.saveOrder('complete');
      }
    }
  }

  unsavedDataUpdateAndClose(openNew) {
    this.dialogRef.close({
      openNew,
      unsavedData: this.saveOrder('unsave')
    });
  }

  handlePopupClose(type = 'new') {
    if ( type === 'after-save') {
      this.dialogRef.close();
    }
  }
}
