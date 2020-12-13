import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { UpdateAttandanceComponent } from './update-attandance/update-attandance.component';

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
  attendanceList:any[]=[];
  constructor(
    private _serv: DataService,
    private dialog: MatDialog
  ) { 
    this.dateSet = this.currentMonthDates.map(x => x.format('DD'));
  }

  ngOnInit(): void {
    this.getUserAttendance();
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
    this.getUserAttendance();
  }

  getUserAttendance() {
    this.attendanceList=[];
    this._serv.endpoint="order-manager/user-attendance?startDate="+this.startDate+"&endDate="+this.endDate;
    this._serv.get().subscribe((response:any[]) => {
      this.attendanceList = response.map(user => {
        user['attendanceList'] = {};
        user['presentCount'] = 0;
        user.attendance.forEach(att => {
          user['attendanceList'][moment(att['effectedDate']).format('DD')] = att;
          if(att.isPresent) {
            user['presentCount']++;
          }
        })
        return user;
      })
      console.log(this.attendanceList);
      
    })
  }

  updateAttendance(user, day) {
    let previousData = user.attendanceList.hasOwnProperty(day) ? user.attendanceList[day]:null;
    let date = moment(this.startDate).format('YYYY-MM') + "-" + day;
    let dialogRef = this.dialog.open(UpdateAttandanceComponent, {
      data: {
        user: user,
        date: date,
        previousData: previousData
      }
    })
    dialogRef
  }

}
