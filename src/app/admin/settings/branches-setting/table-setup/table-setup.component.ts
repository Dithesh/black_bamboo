import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup} from '@angular/forms';
import {merge} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';

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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private serv: DataService,
    private route: ActivatedRoute,
    private router: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.userData = this.serv.getUserData();
    this.route.data.subscribe(({tableList}) => {
      this.tableList = tableList;
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
      pageNumber: page
    };
    this.serv.endpoint = 'order-manager/table-manager';
    this.serv.getByParam(filterValue).subscribe(response => {
      this.tableList = response as any;
    });
  }

  deleteTable(table) {

  }

}
