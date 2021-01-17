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
  savingUpdate=false;
  constructor(private fb:FormBuilder, private route:ActivatedRoute, private _serv:DataService, private router:Router) {
    this.form = this.fb.group({
      id:[''],
      itemName:[''],
      pricePerUnit:[''],
      unitId:[''],
      description:[''],
      isActive:[true],
      company_id:[''],
    })

    this.inventoryId = this.route.snapshot.params.id;
    if(this.inventoryId){
      this.form.get('id').setValue(this.inventoryId);
      this.getInventoryDetails(this.inventoryId);
    }
    this.userData = this._serv.getUserData();
  
    this.route.parent.parent.data.subscribe(response => {
      this.companyList = response.companyList;
      if(this.companyList.length > 0)
        this.form.get('company_id').setValue(this.companyList[0].id)
    })

   }

  ngOnInit() {
    this.getAllUnits()
  }
  getInventoryDetails(id){
    this._serv.endpoint = "account-manager/inventory/"+id;
    this._serv.get().subscribe((response:any[]) => {
         this.form.patchValue(response);
    })
  }
  getAllUnits() {
    this.unitList=[];
    this._serv.endpoint = "account-manager/unit?companyId="+this.form.get('company_id').value;
    this._serv.get().subscribe((response:any[]) => {
      this.unitList = response;
    })
  }

  saveInventory(event=null) {
    if(event!=null)event.preventDefault();
    this.form.markAllAsTouched();
    if(this.form.invalid)return;
    this.savingUpdate=true;
    let formValue = this.form.value;
    this._serv.endpoint="account-manager/inventory";
    this._serv.post(formValue).subscribe((response:any) => {
      this.savingUpdate=false;
      let message = this.form.get('itemName').value + ' updated successfully';
      if(this.form.get('id').value == ""){
        message = this.form.get('itemName').value + ' added successfully';
        this.router.navigateByUrl('/admin/account-management/masters/inventory/update/'+response.id);
      }
      this._serv.showMessage(message, 'success');
      this.form.get('itemName').setValue('');
      this.form.get('pricePerUnit').setValue('');
      this.form.get('description').setValue('');
    }, ({error}) => {
      this.savingUpdate=false;
      if(error.hasOwnProperty('msg')) {
        this._serv.showMessage(error.msg, 'error');
      }else {
        this._serv.showMessage('Something went wrong. Please contact administator', 'error');
      }
    })
  }
}
