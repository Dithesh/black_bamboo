import { merge } from 'rxjs';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  // displayedColumns: string[] = ['action', 'productNumber', 'productName', 'description', 'branch', 'isActive'];
  dataSource;
  filterForm:FormGroup;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _serv: DataService,
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
    this.getAllProducts();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges).pipe(
      debounceTime(500)
    ).subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getAllProducts(this.paginator.pageIndex + 1)
      });
  }

  getAllProducts(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/product?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }


  changeStatus(data) {
    this._serv.endpoint="order-manager/product/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Product status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  deleteProduct(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/product/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Product deleted successfully", 'success');
          this.getAllProducts();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}
