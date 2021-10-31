import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../../shared/services/data.service";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-basic-profile',
  templateUrl: './basic-profile.component.html',
  styleUrls: ['./basic-profile.component.scss']
})
export class BasicProfileComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  branchData;
  constructor(
    private route: ActivatedRoute,
    private serv: DataService
  ) {
    this.route.data.subscribe(respose => {
      this.branchData = respose.branchDetails;
      if (this.serv.notNull(respose.branchLogo)){
        this.imageSrc = 'url(\'' + this.url + respose.branchLogo + '\')';
      }
    });
  }

  ngOnInit(): void {
  }

}
