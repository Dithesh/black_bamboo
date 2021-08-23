import { DataService } from 'src/app/shared/services/data.service';
import { id } from '@swimlane/ngx-charts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-inventory-manager',
  templateUrl: './update-inventory-manager.component.html',
  styleUrls: ['./update-inventory-manager.component.scss']
})
export class UpdateInventoryManagerComponent implements OnInit {
  form: FormGroup;
  inventoryId;
  userData;
  companyList;
  unitList;
  savingUpdate = false;
  branchList: any[] = [];
  private selectedCompanySubscriber: any;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private serv: DataService, private router: Router) {
    this.form = this.fb.group({
      id: [''],
      itemName: [''],
      pricePerUnit: [''],
      unitId: [''],
      description: [''],
      isActive: [true],
      company_id: [''],
      branch_id: [''],
    });



    this.inventoryId = this.route.snapshot.params.id;
    if (this.inventoryId){
      this.form.get('id').setValue(this.inventoryId);
      this.getInventoryDetails(this.inventoryId);
    }
    this.userData = this.serv.getUserData();


    if (this.userData.roles === 'Super Admin') {
      this.route.parent.data.subscribe(response => {
        this.companyList = response.companyList;
        if (this.companyList.length > 0) {
          this.form.get('company_id').setValue(this.companyList[0].id);
          this.getAllBranches();
        }
      });
    } else if (this.userData.roles === 'Company Admin') {
      this.form.get('company_id').setValue(this.userData.company_id);
      this.getAllBranches();
    }else {
      this.form.get('company_id').setValue(this.userData.company_id);
      this.form.get('branch_id').setValue(this.userData.branch_id);
      this.getAllUnits();
    }

   }

  ngOnInit() {
    this.selectedCompanySubscriber = this.form.get('company_id').valueChanges.subscribe(response => {
      this.form.get('branch_id').setValue('', {emitEvent: false});
      this.branchList = [];
      this.getAllBranches();
    });
  }

  getAllBranches() {
    this.serv.endpoint = 'order-manager/branch?status=active&companyId=' + this.form.get('company_id').value;
    this.serv.get().subscribe((response: any[]) => {
      this.branchList = response;
    });
  }
  getInventoryDetails(id){
    this.serv.endpoint = 'account-manager/inventory/' + id;
    this.serv.get().subscribe((response: any) => {
         this.form.patchValue({
           ...response,
           company_id: response.branch.company_id
         }, {emitEvent: false});
         this.getAllUnits();
         this.getAllBranches();
    });
  }
  getAllUnits() {
    this.unitList = [];
    this.serv.endpoint = 'account-manager/unit?branch_id=' + this.form.get('branch_id').value;
    this.serv.get().subscribe((response: any[]) => {
      this.unitList = response;
    });
  }

  saveInventory(event= null) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    this.savingUpdate = true;
    const formValue = this.form.value;
    this.serv.endpoint = 'account-manager/inventory';
    this.serv.post(formValue).subscribe((response: any) => {
      this.savingUpdate = false;
      let message = this.form.get('itemName').value + ' updated successfully';
      if (this.form.get('id').value === ''){
        message = this.form.get('itemName').value + ' added successfully';
      }
      this.serv.showMessage(message, 'success');
      this.router.navigateByUrl('/admin/account-management/inventory/list');
    }, ({error}) => {
      this.savingUpdate = false;
      if (error.hasOwnProperty('msg')) {
        this.serv.showMessage(error.msg, 'error');
      }else {
        this.serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    });
  }
}
