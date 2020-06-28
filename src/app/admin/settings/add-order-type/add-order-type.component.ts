import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-order-type',
  templateUrl: './add-order-type.component.html',
  styleUrls: ['./add-order-type.component.scss']
})
export class AddOrderTypeComponent implements OnInit {

  displayedColumns: string[] = ['action', 'tableId', 'description', 'noOfChair'];
  form: FormGroup;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  branchList: any[];
  orderTypeId;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { 
    this.orderTypeId = this.route.snapshot.params.id;
    if(this.orderTypeId) {
      this.getOrderTypeDetails();
    }
    this.form = this.fb.group({
      id: [''],
      typeName: [''],
      description: [''],
      enableTables: [''],
      enableExtraInfo: [''],
      enableDeliverCharge: [''],
      enableExtraCharge: [''],
      isActive: [''],
      branch_id: [''],
      tables: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    this.getAllBranches();
  }

  get tables() {
    return this.form.get('tables') as FormArray;
  }

  addAnotherTable() {
    this.tables.push(this.addTable());
    this.dataSource.next(this.tables.controls);
  }

  addTable(tableValue=null) {
    let table =  this.fb.group({
      id: [''],
      tableId: [''],
      description: ['d'],
      noOfChair: [''],
      isActive: [''],
      deletedFlag: [false]
    });
    if(tableValue != null) {
      table.patchValue(tableValue);
    }
    return table;
  }

  removeTable(index) {
    let control = this.tables.controls[index];
    if(control.get('id').value != '') {
      let value = control.value;
      control.reset();
      control.patchValue({
        deletedFlag: true,
        id: value.id
      });
    }else {
      this.tables.removeAt(index);
    }
  }

  getOrderTypeDetails() {

  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
      if(this.orderTypeId == undefined && this.branchList.length > 0) {
        this.form.get('branch_id').setValue(this.branchList[0].id);
      }
    })
  }

}
