import { Component, HostListener, OnInit } from '@angular/core';
import { LayoutService } from './layout/services/layout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isOpened=false;
  noPadding=false;
  constructor(
    public _layout: LayoutService,
    private router: Router
    ) { 
      window.addEventListener('resize', (event) => {
        this._layout.handleIsOpened();
      })
    }

  ngOnInit(): void {
    this.handleRouting();
    this.router.events.subscribe(response => {
      this.handleRouting();
    })
  }

  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this._layout.handleIsOpened();
  }

  handleRouting(){
    // let url = this.router.url;
    // let noPaddingArray = [
    //   '/admin/account',
    //   '/admin/settings/company',
    //   '/admin/user',
    //   '/admin/products',
    //
    // ];
    // if(url.indexOf('/admin/account') >= 0 || url.indexOf('/admin/settings/company') >= 0 || url.indexOf('/admin/user') >= 0 ||
    //   url.indexOf('/admin/products') >= 0 || url.indexOf('/admin/settings/branches') >= 0 || url.indexOf('/admin/order') >= 0 || url.indexOf('/admin/settings/categories') >= 0  || url.indexOf('/admin/reports') >= 0)  {
    //   this.noPadding = true;
    // }else {
    //   this.noPadding = false;
    // }
  }

}
