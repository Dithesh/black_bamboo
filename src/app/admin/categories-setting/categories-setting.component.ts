import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit {
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
