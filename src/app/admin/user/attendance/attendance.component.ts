import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  monthlyDates;
  currentMonth = moment(new Date());
  currentMonthDates = new Array(moment(this.currentMonth).daysInMonth()).fill(null).map((x, i) => moment(this.currentMonth).startOf('month').add(i, 'days'));
  startDate = this.currentMonthDates[0].format('YYYY-MM-DD');
  endDate = this.currentMonthDates[this.currentMonthDates.length - 1].format('YYYY-MM-DD');
  dateSet=[];
  constructor(
    private _serv: DataService
  ) { 
    this.dateSet = this.currentMonthDates.map(x => x.format('DD'));
  }

  ngOnInit(): void {
  }

  moveCalendarMonths(type) {
    if(type=='next'){
      this.currentMonth = this.currentMonth.add(1, 'month');
    }else {
      this.currentMonth = this.currentMonth.add(-1, 'month');
    }
    this.currentMonthDates = new Array(moment(this.currentMonth).daysInMonth()).fill(null).map((x, i) => moment(this.currentMonth).startOf('month').add(i, 'days'));
    
    this.startDate = this.currentMonthDates[0].format('YYYY-MM-DD');
    this.endDate = this.currentMonthDates[this.currentMonthDates.length - 1].format('YYYY-MM-DD');
    this.dateSet = this.currentMonthDates.map(x => x.format('DD'));
  }

}
