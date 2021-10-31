import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { environment } from 'src/environments/environment';
import {ipcMain, IpcRenderer} from 'electron';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.scss']
})
export class UpdateBranchComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  branchId;
  userData;
  companyList: any[] = [];
  form: FormGroup;
  ipc;
  printerList: any[] = [];
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router)
     {

      if ((<any>window).ipcRenderer) {
        try {
          this.ipc = (window as any).ipcRenderer;
        } catch (error) {
          // throw error;
        }
      } else {
        console.warn('Could not load electron ipc');
      }
      this.branchId = this.route.snapshot.params.id;
      this.form = this.fb.group({
      id: [''],
      image: [''],
      branchCode: [''],
      branchTitle: [''],
      description: [''],
      branchAddress: [''],
      gstNumber: [''],
      isActive: [false],
      completeConfirmation: [false],
      cancelConfirmation: [false],
      afterCompleteKot: [false],
      onCompleteCancelOrder: ['stayInSame'],
      onSaveOrder: ['stayInSame'],
      taxPercent: [''],
      billPrinter: [''],
      kotPrinter: [''],
      company_id: [''],
      kitchens: this.fb.array([]),
      rooms: this.fb.array([]),
      orderTypes: this.fb.array([]),
      paymentMethods: this.fb.array([]),
    });
      this.route.data.subscribe(response => {
      this.companyList = response.companyList;
      if (this.companyList.length > 0) {
        this.form.get('company_id').setValue(this.companyList[0].id);
      }
    });
  }

  ngOnInit(): void {
    this.userData = this.serv.getUserData();
    if (this.branchId) {
      this.getBranchDetails();
    }
    if (this.ipc) {
      this.ipc.send('get_print_devices', null);
      this.ipc.on('list_of_printers', (event, arg) => {
        this.printerList = arg;
      });
    }
  }

  get paymentMethods() {
    return this.form.get('paymentMethods') as FormArray;
  }

  addNewPaymentMethod() {
    return this.fb.group({
      id: [''],
      methodTitle: [''],
      deletedFlag: [false]
    });
  }

  addAnotherPaymentMethod() {
    this.paymentMethods.push(this.addNewPaymentMethod());
  }

  deletePaymentMethod(item, index) {
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.paymentMethods.removeAt(index);
    }
  }

  get rooms() {
    return this.form.get('rooms') as FormArray;
  }

  addNewRoom() {
    return this.fb.group({
      id: [''],
      roomName: [''],
      withAc: [false],
      serveLiquor: [false],
      isActive: [true],
      deletedFlag: [false]
    });
  }

  addAnotherRoom() {
    this.rooms.push(this.addNewRoom());
  }

  deleteRoom(item, index) {
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.rooms.removeAt(index);
    }
  }

  get kitchens() {
    return this.form.get('kitchens') as FormArray;
  }

  addNewKitchen() {
    return this.fb.group({
      id: [''],
      kitchenTitle: [''],
      deletedFlag: [false]
    });
  }

  addAnotherKitchen() {
    this.kitchens.push(this.addNewKitchen());
  }

  deleteKitchen(item, index) {
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.kitchens.removeAt(index);
    }
  }

  get orderTypes() {
    return this.form.get('orderTypes') as FormArray;
  }

  addOrderType() {
    return this.fb.group({
      id: [''],
      orderType: [''],
      tableRequired: [false],
      isActive: [true],
      deletedFlag: [false]
    });
  }

  addAnotherOrderType() {
    this.orderTypes.push(this.addOrderType());
  }

  deleteOrderType(item, index) {
    if (this.serv.notNull(item.get('id').value)) {
      item.get('deletedFlag').setValue(true);
    }else {
      this.orderTypes.removeAt(index);
    }
  }

  getBranchDetails() {
    this.serv.endpoint = 'order-manager/branch/' + this.branchId;
    this.serv.get().subscribe((data: any) => {
      this.form.patchValue(data);

      if (this.serv.notNull(data.branchLogo)){
        this.imageSrc = 'url(\'' + this.url + data.branchLogo + '\')';
      }

      data.rooms.forEach(elem => {
        const form = this.addNewRoom();
        form.patchValue(elem);
        this.rooms.push(form);
      });
      data.kitchens.forEach(elem => {
        const form = this.addNewKitchen();
        form.patchValue(elem);
        this.kitchens.push(form);
      });
      data.order_types.forEach(elem => {
        const form = this.addOrderType();
        form.patchValue(elem);
        this.orderTypes.push(form);
      });
      data.payment_methods.forEach(elem => {
        const form = this.addNewPaymentMethod();
        form.patchValue(elem);
        this.paymentMethods.push(form);
      });
      // data.tables.forEach(elem => {
      //   this.tables.push(this.addTable(elem));
      //   this.dataSource.next(this.tables.controls);
      // })
    });
  }


  saveBranch(event= null) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = this.form.value;
    this.serv.endpoint = 'order-manager/branch';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Branch updated successfully', 'success');
      this.router.navigateByUrl('/admin/settings/branches');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }


  handleFileInput(event) {
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(file) {
    const reader = file.target;
    const imageSrc = reader.result;
    this.form.get('image').setValue(imageSrc);
    this.imageSrc = 'url(\''+imageSrc+'\')';
  }
}
