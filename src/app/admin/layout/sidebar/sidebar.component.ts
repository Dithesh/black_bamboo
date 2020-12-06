import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  settingOpen=false;
  accoutnOpen=false;
  constructor(public _layout: LayoutService, private router: Router, public _serv: DataService) { 
  }

  ngOnInit(): void {
  }
  openSubmenu(){
    this.settingOpen = !this.settingOpen;
    this._layout.isOpened = true;
  }
  openAccountMenu(){
    this.accoutnOpen = !this.accoutnOpen;
    this._layout.isOpened = true;
  }

  signOut() {
    localStorage.removeItem('lock_token');
    this.router.navigateByUrl('/');
  }
}
