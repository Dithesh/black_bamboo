import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  action:any;
  name: string;
  branch: string;
  number: number;
}

const TABLE_DATA: PeriodicElement[] = [
  {action:'', name: 'jone', branch: 'Mangalore', number: 1},
  {action:'', name: 'jony', branch: 'Kudla', number: 1},
];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  filterOn=false;
  displayedColumns: string[] = ['action', 'name', 'branch', 'number'];
  dataSource = new MatTableDataSource(TABLE_DATA);
  
  sidemenu=false;
  form:FormGroup;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
 
  constructor(
    private _serv: DataService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }
  

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  updateUser(item = null) {
    this.sidemenu = true;
  }
  cancelUser(){
    this.sidemenu = false;
  }

}
