import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss']
})
export class BranchListComponent implements OnInit {

  displayedColumns: string[] = ['action', 'branchCode', 'branchTitle', 'description', 'branchAddress', 'isActive'];
  dataSource;
  filterForm:FormGroup;
  companyList;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route:ActivatedRoute
  ) {
    this.filterForm = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: [''],
      companyFilter:['']
    });
    this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0){
        this.filterForm.get('companyFilter').setValue(this.companyList[0].id);
      }
    })
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.getAllBranches();
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getAllBranches(this.paginator.pageIndex + 1)
      });
  }

  getAllBranches(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/branch?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString+'&companyId='+filterValue.companyFilter;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/branch/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Branch status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  deleteBranch(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/branch/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Branch deleted successfully", 'success');
          this.getAllBranches();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }
}
