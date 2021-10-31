import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../../shared/services/data.service";

@Component({
  selector: 'app-app-configuration',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.scss']
})
export class AppConfigurationComponent implements OnInit {
  form: FormGroup = this.fb.group({
      id: [''],
      completeConfirmation: [false],
      cancelConfirmation: [false],
      afterCompleteKot: [false],
      onCompleteCancelOrder: ['stayInSame'],
      onSaveOrder: ['stayInSame'],
      billPrinter: [''],
      kotPrinter: ['']
    });
  ipc;
  printerList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private serv: DataService,
    private zone: NgZone
  ) {
    this.route.data.subscribe(response => {
      this.form.patchValue(response.branchDetails);
    });
    if ((<any>window).ipcRenderer) {
      try {
        this.ipc = (window as any).ipcRenderer;
      } catch (error) {
        // throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  ngOnInit(): void {
    if (this.ipc) {
      this.ipc.send('get_print_devices', null);
      this.ipc.on('list_of_printers', (event, arg) => {
        this.zone.run(_ => {
          this.printerList = arg;
        });
      });
    }
  }

  saveBranch(event= null) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = this.form.value;
    this.serv.endpoint = 'order-manager/branch/configure';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Branch updated successfully', 'success');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }
}
