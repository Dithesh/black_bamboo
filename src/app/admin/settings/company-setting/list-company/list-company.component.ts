import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/shared/services/data.service';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent implements OnInit {

  // displayedColumns: string[] = ['action', 'companyName', 'companyDetails', 'branches', 'accounting','Restaurant' 'isActive'];
  dataSource;
  filterForm:FormGroup;
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
    });
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    this.getAllCompanys();
  }
  
  ngAfterViewInit() {
    
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
    //   .subscribe(data => {
    //     this.filterForm.patchValue({
    //       orderCol: this.sort.active,
    //       orderType: this.sort.direction
    //     })
    //     this.getAllCompanys(this.paginator.pageIndex + 1)
    //   });
  }

  getAllCompanys(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/company?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString+'&compnayId='+filterValue.companyFilter;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/company/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Company status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  deleteCompany(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/company/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Company deleted successfully", 'success');
          this.getAllCompanys();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
