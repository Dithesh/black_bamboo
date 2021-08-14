import { InventoryStockUpdateComponent } from './inventory-stock-update/inventory-stock-update.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from 'src/app/shared/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit, AfterViewInit {
  inventoryId;
  inventoryData;
  inventoryHistoryList;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private route:ActivatedRoute,
    private _serv:DataService,
    private dialog:MatDialog
    ) {

    this.inventoryId = this.route.snapshot.params.id;
    if(this.inventoryId){
      this.getInventoryDetails(this.inventoryId);
    }
   }

  ngOnInit(): void {
    this.getInventoryHistory();
  }
  ngAfterViewInit() {
    
    this.paginator.page.subscribe(data => {
        this.getInventoryHistory(this.paginator.pageIndex + 1)
      });
  }

  getInventoryHistory(page=1) {
    this.inventoryHistoryList=[];
    this._serv.endpoint = "account-manager/inventory/inventory-history/"+this.inventoryId+"?pageNumber="+page;
    this._serv.get().subscribe((response:any) => {
      this.inventoryHistoryList = response;
    })
  }

  getInventoryDetails(id){
    this._serv.endpoint = "account-manager/inventory/"+id;
    this._serv.get().subscribe((response:any[]) => {
      this.inventoryData = response;
    })
  }

  updateStockDetails(){
    let dialogRef = this.dialog.open(InventoryStockUpdateComponent, {
      autoFocus:false,
      data: {
        id:this.inventoryId,
        managerId: this.inventoryData.managerId
      }
    })
    dialogRef.afterClosed().subscribe(response => {
      this.getInventoryHistory();
      this.getInventoryDetails(this.inventoryId);
    })
  }

}
