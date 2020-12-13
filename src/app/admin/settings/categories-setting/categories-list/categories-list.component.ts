import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { merge } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['action', 'categoryName', 'description', 'branch', 'isActive'];
  imageSrc="url(\'/assets/images/food.jpg\')";
  url = environment.imgUrl;
  dataSource;
  sidemenu=false;
  form:FormGroup;
  filterForm:FormGroup;
  branchList: any[];
  userData;

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
    this.userData = this._serv.getUserData();
    this.getAllCategories();
  }

  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        })
        this.getAllCategories(this.paginator.pageIndex + 1)
      });
  }

  getAllCategories(page=1) {
    let filterValue=this.filterForm.value;
    this._serv.endpoint = "order-manager/category?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString;
    this._serv.get().subscribe(response => {
      this.dataSource = response as any;
    })
  }

  changeStatus(data) {
    this._serv.endpoint="order-manager/category/status/"+data.id;
    this._serv.put(data).subscribe(response => {
      this._serv.showMessage("Category status changed successfully", 'success');
    }, ({error}) => {
      this._serv.showMessage(error['msg'], 'error');
    })
  }

  getAllBranches() {
    this._serv.endpoint = "order-manager/branch?fields=id,branchTitle";
    this._serv.get().subscribe(response => {
      this.branchList = response as any[];
    })
  }

  deleteCategory(item) {
    let dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        this._serv.endpoint = "order-manager/category/"+item.id;
        this._serv.delete().subscribe(response => {
          this._serv.showMessage("Category deleted successfully", 'success');
          this.getAllCategories();
        }, ({error}) => {
          this._serv.showMessage(error['msg'], 'error');
        })
      }
    })
  }

}

