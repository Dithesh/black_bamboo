import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-table-manager',
  templateUrl: './add-table-manager.component.html',
  styleUrls: ['./add-table-manager.component.scss']
})
export class AddTableManagerComponent implements OnInit {
  displayedColumns: string[] = ['action', 'tableId', 'description', 'noOfChair', 'branch_id', 'isActive'];
  form: FormGroup;
  dataSource = new BehaviorSubject<AbstractControl[]>([]);
  branchList: any[];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  companyList;
  userData: any;

  
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _det: ChangeDetectorRef
  ) {  
    
    this.form = this.fb.group({
      company_id: [''],
      tables: this.fb.array([])
    });
    
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.form.get('company_id').setValue(this.companyList[0].id);
        this.getAllBranches();
        this.getTableList();
    })
  }

  ngOnInit(): void {
    this.userData = this._serv.getUserData();
  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle&companyId="+this.form.get('company_id').value;
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }

  
  getTableList() {

    this._serv.endpoint = "order-manager/table-manager?companyId="+this.form.get('company_id').value;
    this._serv.get().subscribe(response => {
      let data = response as any[];
      this.tables.controls = [];
      this.tables.reset();
      this.dataSource.next(this.tables.controls);
      if(data.length > 0) {
        data.forEach(elem => {
          this.tables.push(this.addTable(elem));
          this.dataSource.next(this.tables.controls);
        })
        this._det.detectChanges();
      }else {
        this.addAnotherTable()
      }
    })
  }

  get tables() {
    return this.form.get('tables') as FormArray;
  }

  addAnotherTable() {
    let table = this.addTable();
    if(this.branchList.length > 0) {
      table.get('branch_id').setValue(this.branchList[0].id)
    }
    this.tables.push(table);
    this.dataSource.next(this.tables.controls);
  }

  addTable(tableValue=null) {
    let table =  this.fb.group({
      id: [''],
      tableId: [''],
      description: [''],
      noOfChair: [''],
      isActive: [true],
      branch_id: [''],
      deletedFlag: [false]
    });
    if(tableValue != null) {
      table.patchValue(tableValue);
    }
    return table;
  }

  removeTable(index) {
    if(this._serv.formArrayCount(this.tables) <= 1) return;
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
    this.dataSource.next(this.tables.controls);
  }

  

  saveTableManager(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    let formValue = this.form.value;
    this._serv.endpoint="order-manager/table-manager";
    
    this._serv.post(formValue).subscribe(response => {
      this._serv.showMessage("Tables updated successfully", 'success');
      this.getTableList();
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }
}
