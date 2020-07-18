import { Component, OnInit, Input } from '@angular/core';
import { MasterLayoutService } from './master-layout.service';

@Component({
  selector: 'app-ac-layout',
  templateUrl: './ac-layout.component.html',
  styleUrls: ['./ac-layout.component.scss']
})
export class AcLayoutComponent implements OnInit {

  isOpened=false;
  @Input('sideBarDisable') sideBarDisable = false;

  constructor(public _layout: MasterLayoutService) { }

  ngOnInit(): void {
  }

}
