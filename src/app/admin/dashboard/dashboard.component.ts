import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  content=""
  toggle=false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleContent() {
    this.toggle=!this.toggle;
    this.content=this.content + `Finally, if your app's content is not placed inside of a mat-sidenav-container element, you need to add the mat-app-background class to your wrapper element (for example the body). This ensures that the proper theme background is applied to your page.`
  }

}
