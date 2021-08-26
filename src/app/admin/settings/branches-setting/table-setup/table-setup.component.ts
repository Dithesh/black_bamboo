import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {merge} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {ConfirmPopupComponent} from '../../../../shared/components/confirm-popup/confirm-popup.component';
import {TableUpdateComponent} from './table-update/table-update.component';

@Component({
  selector: 'app-table-setup',
  templateUrl: './table-setup.component.html',
  styleUrls: ['./table-setup.component.scss']
})
export class TableSetupComponent implements OnInit, AfterViewInit {
  filterForm: FormGroup = this.fb.group({
      searchString: [''],
      orderCol: [''],
      orderType: ['']
    });
  tableList: any;
  userData;
  branchId;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  brandDetails: any;

  constructor(
    private serv: DataService,
    private route: ActivatedRoute,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.branchId = this.route.snapshot.params.id;
    this.getBranchDetails();
  }

  ngOnInit(): void {
    this.userData = this.serv.getUserData();
    this.route.data.subscribe(({tableList}) => {
      this.tableList = tableList;
    });
  }


  getBranchDetails() {
    this.serv.endpoint = 'order-manager/branch/' + this.branchId;
    this.serv.get().subscribe((data: any) => {
      this.brandDetails = data;
    });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page, this.filterForm.get('searchString').valueChanges)
      .subscribe(data => {
        this.filterForm.patchValue({
          orderCol: this.sort.active,
          orderType: this.sort.direction
        });
        this.getAllTables(this.paginator.pageIndex + 1);
      });
  }

  getAllTables(page= 1){
    const filterValue = {
      ...this.filterForm.value,
      pageNumber: page,
      branchId: this.branchId
    };
    this.serv.endpoint = 'order-manager/table-manager';
    this.serv.getByParam(filterValue).subscribe(response => {
      this.tableList = response as any;
    });
  }

  updateTable(table = null) {
    if (table == null) {
      table = {
        id: '',
        tableId: '',
        noOfChair: 4,
        description: '',
        isReserved: false,
        isActive: true,
        branch_id: this.branchId
      };
    }
    const dialogRef = this.dialog.open(TableUpdateComponent, {
      width: '500px',
      data: {
        table
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      this.getAllTables();
    });
  }



  deleteTable(table) {
    const dialogRef = this.dialog.open(ConfirmPopupComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.serv.endpoint = 'order-manager/table-manager/table/' + table.id;
        this.serv.delete().subscribe(response => {
          this.serv.showMessage('Table deleted successfully', 'success');
          this.getAllTables();
        }, ({error}) => {
          this.serv.showMessage(error.msg, 'error');
        });
      }
    });
  }

}
