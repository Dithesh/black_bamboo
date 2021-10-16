import {Component, Inject, OnInit} from '@angular/core';
import {NewOrderComponent} from "../../new-order/new-order.component";
import {FormBuilder} from "@angular/forms";
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
      } else if (e.ctrlKey && e.code === 'KeyN') {
        if (this.items.length > 0 || this.comboItems.length > 0) {
          if (this.isDirty) {
            if (this._serv.notNull(this.form.get('id').value)) {
              const dialogRef = this.dialog.open(ConfirmPopupComponent, {
                data: {
                  message: 'Order data is updated. Do you want to save'
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                if (data) {
                  this.saveOrder('confirm', () => {
                    this.dialogRef.close({
                      openNew: true
                    });
                  });
                }else {
                  this.dialogRef.close({
                    openNew: true
                  });
                }
              });
            }else {
              //neds tp be handled
            }
          }else {
            this.dialogRef.close({
              openNew: true
            });
          }
        }
      }
    }
  }

  handlePopupClose(type = 'new') {
    console.log(type)
    if ( type === 'after-save') {
      this.dialogRef.close();
    }
  }
}
