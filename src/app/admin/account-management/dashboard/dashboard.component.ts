import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // multi: any[];
  // view: any[] = [1500];
  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Months';
  yAxisLabel: string = 'Amount';
  timeline: boolean = true;
  dashStats:any[]=[];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  // multi = [
  //   {
  //     "name": "Germany",
  //     "series": [
  //       {
  //         "name": "1990",
  //         "value": 62000000
  //       },
  //       {
  //         "name": "2010",
  //         "value": 73000000
  //       },
  //       {
  //         "name": "2011",
  //         "value": 89400000
  //       }
  //     ]
  //   },
  
  //   {
  //     "name": "USA",
  //     "series": [
  //       {
  //         "name": "1990",
  //         "value": 250000000
  //       },
  //       {
  //         "name": "2010",
  //         "value": 309000000
  //       },
  //       {
  //         "name": "2011",
  //         "value": 311000000
  //       }
  //     ]
  //   },
  
  //   {
  //     "name": "France",
  //     "series": [
  //       {
  //         "name": "1990",
  //         "value": 58000000
  //       },
  //       {
  //         "name": "2010",
  //         "value": 50000020
  //       },
  //       {
  //         "name": "2011",
  //         "value": 58000000
  //       }
  //     ]
  //   },
  //   {
  //     "name": "UK",
  //     "series": [
  //       {
  //         "name": "1990",
  //         "value": 57000000
  //       },
  //       {
  //         "name": "2010",
  //         "value": 62000000
  //       }
  //     ]
  //   }
  // ];
  transactionList

  constructor(
    private _serv: DataService,
    private router: Router
  ) {
    // Object.assign(this, { this.multi });
  }

  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    this.getDashStats();
    this.getTransactions();
  }

  getTransactions(page=1) {
    this._serv.endpoint = "account-manager/transaction?pageNumber="+page
                    + "&perPage=10"
                    + "&transactionType="
                    + "&orderCol=updated_at"
                    + "&orderType=desc"
    this._serv.get().subscribe(response => {
      this.transactionList = response['data'] as any;
      
    })
  }

  getDashStats() {
    this._serv.endpoint="account-manager/transaction/report-dash/monthly";
    this._serv.get().subscribe((response:any) => {
      console.log(response);
      this.dashStats  = [];
      let salesData = {
        name : "Sales",
        series: []
      };
      let purchaseData = {
        name : "Purchase",
        series: []
      };
      let paymentData = {
        name : "Payment",
        series: []
      };
      let receiptData = {
        name : "Receipt",
        series: []
      };
      response.forEach(elem => {
        let salesAmount = 0, purchaseAmount=0, paymentAmount=0, receiptAmount=0;
        elem.stats.forEach(stat => {
          if(stat.transactionType == 'sales') {
            salesAmount = stat.amount;
          } else if(stat.transactionType == 'purchase') {
            purchaseAmount = stat.amount;
          } else if(stat.transactionType == 'payment') {
            paymentAmount = stat.amount;
          } else if(stat.transactionType == 'receipt') {
            receiptAmount = stat.amount;
          }
        })
        salesData.series.push({
          name: moment().month(elem.month - 1).format("MMM"),
          value: salesAmount
        })
        purchaseData.series.push({
          name: moment().month(elem.month - 1).format("MMM"),
          value: purchaseAmount
        })
        paymentData.series.push({
          name: moment().month(elem.month - 1).format("MMM"),
          value: paymentAmount
        })
        receiptData.series.push({
          name: moment().month(elem.month - 1).format("MMM"),
          value: receiptAmount
        })
        
      })

      this.dashStats.push(salesData);
      this.dashStats.push(purchaseData);
      this.dashStats.push(paymentData);
      this.dashStats.push(receiptData);
      
      // {
      //   "name": "Germany",
      //   "series": [
      //     {
      //       "name": "1990",
      //       "value": 62000000
      //     },
      //     {
      //       "name": "2010",
      //       "value": 73000000
      //     },
      //     {
      //       "name": "2011",
      //       "value": 89400000
      //     }
      //   ]
      // },
    })
  }

  openTransaction(item) {
    this.router.navigateByUrl('/admin/account-management/new-transaction/'+item.transactionType.toLowerCase() + '/'+item.id)
  }
}
