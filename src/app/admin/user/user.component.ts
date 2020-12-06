import { Component, OnInit} from '@angular/core';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  editId;
  constructor(private route:ActivatedRoute, private router:Router, public _serv: DataService){
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
