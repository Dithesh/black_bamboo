import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {DataService} from "../../shared/services/data.service";

@Component({
  selector: 'app-favorite-product',
  templateUrl: './favorite-product.component.html',
  styleUrls: ['./favorite-product.component.scss']
})
export class FavoriteProductComponent implements OnInit {

  editId;
  constructor(private route: ActivatedRoute, private router: Router, public serv: DataService){
  }
  ngOnInit(){
    this.editId = this.route.firstChild.snapshot.params.id;
    this.router.events.subscribe(response => {
      if (response instanceof NavigationEnd){
        this.editId = this.route.firstChild.snapshot.params.id;
      }
    });
  }

}
