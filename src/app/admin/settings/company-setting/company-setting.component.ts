import { merge } from 'rxjs';
import { ConfirmPopupComponent } from 'src/app/shared/components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.scss']
})
export class CompanySettingComponent implements OnInit {
  editId;
  constructor(private route:ActivatedRoute, private router:Router){
  }
  ngOnInit(){
    this.editId = this.route.firstChild.snapshot.params.id;
    this.router.events.subscribe(response=>{
      if(response instanceof NavigationEnd){
        this.editId = this.route.firstChild.snapshot.params.id;
      }
    })
  }

}
