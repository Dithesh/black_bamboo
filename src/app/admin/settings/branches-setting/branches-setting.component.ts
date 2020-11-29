import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-branches-setting',
  templateUrl: './branches-setting.component.html',
  styleUrls: ['./branches-setting.component.scss']
})
export class BranchesSettingComponent implements OnInit {
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