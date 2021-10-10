import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../../shared/services/data.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-profit-and-loss-report',
  templateUrl: './profit-and-loss-report.component.html',
  styleUrls: ['./profit-and-loss-report.component.scss']
})
export class ProfitAndLossReportComponent implements OnInit {
  filterForm: FormGroup = this.fb.group({
    searchString: [''],
    selectedCompany: [''],
    selectedBranch: [''],
    startDate: [''],
    endDate: [''],
    company_id: [''],
    branch_id: [''],
  });
  userData: any;
  companyList: any[] = [];
  branchList: any[] = [];
  pandlReports: any[] = [];
  private selectedCompanySubscriber;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.userData = this.serv.getUserData();

    if (this.userData.roles === 'Super Admin') {
      this.route.data.subscribe(response => {
        this.companyList = response.companyList;
        if (this.companyList.length > 0) {
          this.filterForm.get('selectedCompany').setValue(this.companyList[0].id);
          this.getAllBranches();
        }
      });
    } else if (this.userData.roles === 'Company Admin') {
      this.filterForm.get('selectedCompany').setValue(this.userData.company_id);
      this.getAllBranches();
    }else {
      this.filterForm.get('selectedCompany').setValue(this.userData.company_id);
      this.filterForm.get('selectedBranch').setValue(this.userData.branch_id);
    }
  }

  ngOnInit(): void {
    this.selectedCompanySubscriber = this.filterForm.get('selectedCompany').valueChanges.subscribe(response => {
      this.filterForm.get('selectedBranch').setValue('', {emitEvent: false});
      this.getAllBranches();
    });
  }
  getAllBranches() {
    this.branchList = [];
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.filterForm.get('selectedCompany').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }

  getProfiltAndLossReport(event) {
    event.preventDefault();
    const filterValue = this.filterForm.value;
    let startDate = '', endDate = '';
    if (this.serv.notNull(filterValue.startDate) && this.serv.notNull(filterValue.endDate)) {
      startDate = moment(filterValue.startDate).format('YYYY-MM-DD');
      endDate = moment(filterValue.endDate).format('YYYY-MM-DD');
    }
    this.serv.endpoint = 'account-manager/transaction/reports/profit-top-loss';
    this.serv.getByParam({
      searchString: filterValue.searchString,
      company_id: filterValue.selectedCompany,
      branch_id: filterValue.selectedBranch,
      startDate,
      endDate,
      orderType: filterValue.orderType,
      orderCol: filterValue.orderCol
    }).subscribe((response: any) => {
      this.pandlReports = response['ledgers'] as any[];
      // const result = [];
      // Object.keys(response).forEach(key => {
      //   // const res = {};
      //   // const items = response[key];
      //   // res['productName'] = items[0].productName;
      //   // res['isSingle'] = !items[0].isAdvancedPricing;
      //   // res['items'] = items;
      //   // result.push(res);
      // });
      // this.itemList = result;
      // console.log(this.itemList);

    });

  }
}
