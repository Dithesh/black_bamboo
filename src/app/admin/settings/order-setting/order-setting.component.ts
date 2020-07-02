import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-order-setting',
  templateUrl: './order-setting.component.html',
  styleUrls: ['./order-setting.component.scss']
})
export class OrderSettingComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['action', 'typeName', 'description', 'branch', 'isActive'];
  dataSource;
  filterForm:FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { 
    this.filterForm = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: ['']
    });
  }

  ngOnInit(): void {
    this.getOrderTypes();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getOrderTypes(this.paginator.pageIndex + 1)
      });
  }

  getOrderTypes(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/order-type?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }


  changeStatus(data) {
    this._serv.endpoint="order-manager/order-type/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Order type status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  

  deleteOderType(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/order-type/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Order type deleted successfully", 'success');
          this.getOrderTypes();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }
}
