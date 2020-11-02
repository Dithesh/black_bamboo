import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SharedKitchenService } from '../../shared/shared-kitchen.service';

@Component({
  selector: 'app-consolidated-kitchen',
  templateUrl: './consolidated-kitchen.component.html',
  styleUrls: ['./consolidated-kitchen.component.scss']
})
export class ConsolidatedKitchenComponent implements OnInit {

  url = environment.imgUrl;
  constructor(public _kitchen: SharedKitchenService) { }

  ngOnInit(): void {
  }

}
