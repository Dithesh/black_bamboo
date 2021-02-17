import { merge } from 'rxjs';
import { DataService } from './../../../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-lists',
  templateUrl: './order-lists.component.html',
  styleUrls: ['./order-lists.component.scss']
})
export class OrderListsComponent implements OnInit {
  orderStatus=['new', 'accepted', 'prepairing', 'packing', 'dispatched', 'delivered', 'completed', 'cancelled'];
  
  dataSource;
  loginUserDetail;
  filterOn=false;
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
      orderStatus: [''],
      startDate: [''],
      endDate: [''],
      orderCol: [''],
      orderType: ['']
    })
  }

  ngOnInit(): void {
      this.loginUserDetail = this._serv.getUserData();
      this.getOrderList();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges, this.filterForm.get('orderStatus').valueChanges, this.filterForm.get('endDate').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        }, { emitEvent: false })
        this.getOrderList(this.paginator.pageIndex + 1)
      });
  }

  getOrderList(page=1) {
    let filterValue = this.filterForm.value;
    let startDate="", endDate="";
    if(this._serv.notNull(filterValue.startDate) && this._serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this._serv.endpoint = "order-manager/order?pageNumber="+page
                            + "&searchString="+filterValue.searchString
                            + "&orderStatus="+filterValue.orderStatus
                            + "&startDate="+startDate
                            + "&endDate="+endDate
                            + "&orderType="+filterValue.orderType
                            + "&orderCol="+filterValue.orderCol
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
      this.dataSource.data = this.dataSource.data.map(x => {
        return {
          ...x,
          isSelected: false
        }
      })
    })
  }

  getSelectedOrderCount(){
    let count=0;
    if(this.dataSource){
      this.dataSource.data.forEach(elem=>{
        if(elem.isSelected){
          count++;
        }
      })
    }
    return count;
  }

  deleteSelectedOrders() {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        let orderIds = this.dataSource.data.filter(x => x.isSelected).map(x => x.id);
        this._serv.endpoint = 'order-manager/order/'+orderIds.join(',');
        this._serv.delete().subscribe(response => {
          this._serv.showMessage('Orders deleted successfully', 'success');
          this.getOrderList();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
