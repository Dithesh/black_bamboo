import { Component, OnInit } from '@angular/core';
import { LayoutService } from './layout/services/layout.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isOpened=false;
  constructor(public _layout: LayoutService) { }

  ngOnInit(): void {
  }

}
