import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DataService} from '../../shared/services/data.service';

@Component({
  selector: 'app-product-combo',
  templateUrl: './product-combo.component.html',
  styleUrls: ['./product-combo.component.scss']
})
export class ProductComboComponent implements OnInit {

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
