import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from './../../../../shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-custom-report',
  templateUrl: './custom-report.component.html',
  styleUrls: ['./custom-report.component.scss']
})
export class CustomReportComponent implements OnInit {

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
      type: [''],
      includeOrder:[false],
      startDate:[''],
      endDate:[''],
      orderCol: [''],
      orderType: [''],
      companyFilter:['']
    });
    // this.route.data.subscribe(response => {
    //   this.companyList = response.companyList;
    //   if(this.companyList.length > 0){
    //     this.filterForm.get('companyFilter').setValue(this.companyList[0].id);
    //   }
    // })
  }

  ngOnInit(): void {
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.getAllBranches();
  }
  
  ngAfterViewInit() {
    
    // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    // merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
    //   .subscribe(data => {
    //     this.filterForm.patchValue({
    //       orderCol: this.sort.active,
    //       orderType: this.sort.direction
    //     })
    //     this.getAllBranches(this.paginator.pageIndex + 1)
    //   });
  }

  // getAllBranches(page=1) {
  //   let filterValue=this.filterForm.value;
  //   this._serv.endpoint = "order-manager/branch?pageNumber="+page+"&orderType="+filterValue.orderType+"&orderCol="+filterValue.orderCol+"&searchString="+filterValue.searchString+'&compnayId='+filterValue.companyFilter;
  //   this._serv.get().subscribe(response => {
  //     this.dataSource = response as any;
  //   })
  // }
}
