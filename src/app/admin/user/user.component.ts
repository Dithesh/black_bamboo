import { Component, OnInit} from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
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
