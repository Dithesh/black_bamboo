import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  form: FormGroup;
  editIndex: any;
  constructor(
    private fb: FormBuilder,
    private _serv: DataService,
    private dialog: MatDialog
  ) { 
    this.form = this.fb.group({
      units: this.fb.array([]),
      newUnits: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    this.getAllUnits();
  }

  get units() {
    return this.form.get('units') as FormArray;
  }

  get newUnits() {
    return this.form.get('newUnits') as FormArray;
  }

  getAllUnits() {
    this.units.controls = [];
    this.units.reset();
    this._serv.endpoint = "account-manager/unit";
    this._serv.get().subscribe((response: any[]) => {
      response.forEach(elem => {
        let form = this.newUnit();
        form.patchValue(elem);
        this.units.push(form)
      })
      if(response.length == 0){
        this.newUnits.push(this.newUnit());
      }
    })
  }

  addNewUnit() {
    this.newUnits.push(this.newUnit());
  }

  removeNewUnit(index) {
    this.newUnits.removeAt(index);
  }

  newUnit() {
    return this.fb.group({
      id: [''],
      unitLabel: ['', [Validators.required]],
      description: ['']
    });
  }

  saveUnit(unitForm: FormGroup, index=null) {
    unitForm.markAllAsTouched();
    if(unitForm.invalid)return;
    let data = {...unitForm.value};

    
    let api=null;
    this._serv.endpoint="account-manager/unit";
    if(data.id == "") {
      api = this._serv.post(data);
    }else {
      this._serv.endpoint+="/"+data.id;
      api = this._serv.put(data);
    }
    api.subscribe(response => {
      if(data.id == "" && index != null) {
        this.newUnits.removeAt(index);
        this.getAllUnits();
      }else {
        this.editIndex=undefined;
      }
    })
  }

  onEditClick(index) {
    this.editIndex= index;
  }

  deletUnit(index) {
    let item = this.units.controls[index].value;
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "account-manager/unit/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Unit deleted successfully", 'success');
          this.units.removeAt(index);
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
