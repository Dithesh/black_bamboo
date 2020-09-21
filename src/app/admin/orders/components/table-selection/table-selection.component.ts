import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-table-selection',
  templateUrl: './table-selection.component.html',
  styleUrls: ['./table-selection.component.scss']
})
export class TableSelectionComponent implements OnInit {
  form: FormGroup;
  blockForms=false;
  orderId;
  tableList:any[]=[];
  constructor(
    private fb: FormBuilder, 
    private _serv: DataService, 
    @Inject(MAT_DIALOG_DATA) private data,
    public dialogRef: MatDialogRef<TableSelectionComponent>) { 
    this.form = this.fb.group({
      tables: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.data.tables.controls.forEach(control => {
      this.tables.push(control);
    })
  }


  get tables() {
    return this.form.get('tables') as FormArray;
  } 

  selectAllChairs(table) {
    if(this.blockForms)return;
    (table.get('chairs') as FormArray).controls.forEach(elem => {
      if(elem.get('permission').value == 'full') {
        elem.get('isSelected').setValue(true);
      }
    })
  }

  saveTableInfo() {
    let tableData = this.form.value;
    // tableData.tables = tableData.tables.map((table:any) => {
    //   return {
    //     ...table,
    //     chairs: table.chairs.filter(chair => (chair.isSelected && chair.permission == 'full')).map(chair => chair.chairId).join(',')
    //   }
    // }).filter(table => table.chairs != "")
    this.dialogRef.close(this.tables);
  }
}
