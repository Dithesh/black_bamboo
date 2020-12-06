import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-table-manager',
  templateUrl: './table-manager.component.html',
  styleUrls: ['./table-manager.component.scss']
})
export class TableManagerComponent implements OnInit {
  form: FormGroup;
  tableList: any[];
  constructor(
    private fb: FormBuilder,
    public _serv: DataService
  ) { 
    this.form = this.fb.group({
      tables: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getTableInfo()
  }

  get tables() {
    return this.form.get('tables') as FormArray;
  }

  addTables() {
    this.tableList.forEach(t => {
      let chairs = [];
      let selectedChairs = (this._serv.notNull(t.selectedChairs))?t.selectedChairs.split(",").filter(x => x!=""):[];
      t.chairs.forEach(elem => {
        if(elem != "") {
          let permission = "full";
          if(selectedChairs.indexOf(elem.toString()) >= 0) permission="blocked";
          let group = this.fb.group( {
            chairId: [elem],
            permission: [permission],
            isSelected: [{value: (permission=='full')?false:true, disabled: true}, [], ]
          });
          chairs.push(group)
        }
      })

      this.tables.push(this.fb.group({
        id: [t.id],
        tableId: [t.tableId],
        noOfChair: [t.noOfChair],
        isReserved: [t.isReserved],
        chairs: this.fb.array(chairs)
      }))
      
    })
  }



  getTableInfo() {
    this._serv.endpoint = "order-manager/tables";
    this._serv.get().subscribe(response => {
      this.tableList = response as any[];
      this.addTables();
    })
  }

  changeReservedStatus(table) {
    if(!this._serv.getPermission('tables', 'full'))return;
    let value = table.value;
    this._serv.endpoint = "order-manager/table-manager/reserved/"+value.id;
    this._serv.put({isReserved: !value.isReserved}).subscribe(response => {
      table.get('isReserved').setValue(!value.isReserved);
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }


}
