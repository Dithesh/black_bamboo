import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../../shared/services/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TableUpdateComponent} from "../../../shared/components/table-update/table-update.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit {
  form: FormGroup;
  tableList: any[];
  filterForm: FormGroup = this.fb.group({
      companyFilter: ['']
  });
  companyList: any[] = [];
  userData;
  constructor(
    private fb: FormBuilder,
    public serv: DataService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.userData = this.serv.getUserData();
    this.form = this.fb.group({
      branches: this.fb.array([])
    });
    if (this.userData.roles === 'Super Admin') {
      this.route.data.subscribe(response => {
        this.companyList = response.companyList;
        if (this.companyList.length > 0){
          this.filterForm.get('companyFilter').setValue(this.companyList[0].id, {emitEvent: false});
          this.getTableInfo();
        }
      });
    }else {
      this.getTableInfo()
    }
  }

  ngOnInit(): void {
  }


  addBranch() {
    return this.fb.group({
      id: [''],
      branch_name: [''],
      company_name: [''],
      tables: this.fb.array([])
    });
  }

  get branches() {
    return this.form.get('branches') as FormArray;
  }

  tables(index) {
    return this.branches.controls[index].get('tables') as FormArray;
  }

  addTables() {
    this.branches.controls = [];
    this.branches.reset();
    this.tableList.forEach(tableGroup => {
        const form = this.addBranch();
        form.patchValue({
          id: tableGroup.branch.id,
          branch_name: tableGroup.branch.branchTitle,
          company_name: tableGroup.branch.company.companyName,
        });

        tableGroup.tables.forEach(t => {
          const chairs = [];
          const selectedChairs = (this.serv.notNull(t.selectedChairs)) ? t.selectedChairs.split(',').filter(x => x !== '') : [];
          t.chairs.forEach(elem => {
            if (elem !== '') {
              let permission = 'full';
              if (selectedChairs.indexOf(elem.toString()) >= 0) { permission = 'blocked'; }
              const group = this.fb.group( {
                chairId: [elem],
                permission: [permission],
                isSelected: [{value: (permission === 'full') ? false : true, disabled: true}, [], ]
              });
              chairs.push(group);
            }
          });

          (form.get('tables') as FormArray).push(this.fb.group({
            id: [t.id],
            tableId: [t.tableId],
            description: [t.description],
            noOfChair: [t.noOfChair],
            runningOrderIds: [t.runningOrderIds],
            isReserved: [t.isReserved],
            isActive: [t.isActive],
            branch_id: [t.branch_id],
            room_id: [t.room_id],
            chairs: this.fb.array(chairs)
          }));
        });

        this.branches.push(form);
    });
  }



  getTableInfo() {
    this.serv.endpoint = 'order-manager/tables';
    this.serv.getByParam({
      company_id: this.filterForm.get('companyFilter').value
    }).subscribe(response => {
      this.tableList = response as any[];
      this.addTables();
    });
  }
  gotoOrder(orderId){
    this.router.navigateByUrl('/admin/order/update/' + orderId);
  }
  changeReservedStatus(table) {
    if (!this.serv.getPermission('tables', 'full')) {return; }
    const value = table.value;
    this.serv.endpoint = 'order-manager/table-manager/reserved/' + value.id;
    this.serv.put({isReserved: !value.isReserved}).subscribe(response => {
      table.get('isReserved').setValue(!value.isReserved);
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }
  updateTable(branchId, table = null) {
    if (table == null) {
      table = {
        id: '',
        tableId: '',
        noOfChair: 4,
        description: '',
        isReserved: false,
        isActive: true,
        branch_id: branchId
      };
    }
    const dialogRef = this.dialog.open(TableUpdateComponent, {
      width: '500px',
      data: {
        table
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.getTableInfo();
    });
  }


}
