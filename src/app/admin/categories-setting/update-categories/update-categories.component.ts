import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-categories',
  templateUrl: './update-categories.component.html',
  styleUrls: ['./update-categories.component.scss']
})
export class UpdateCategoriesComponent implements OnInit {
  imageSrc = 'url(\'/assets/images/food.jpg\')';
  url = environment.imgUrl;
  form: FormGroup;
  filterForm: FormGroup;
  branchList: any[];
  companyList: any[];
  userData;
  categoryId;
  constructor(
    private serv: DataService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryId = this.route.snapshot.params.id;
    this.form = this.fb.group({
      id: [''],
      image: [''],
      categoryName: [''],
      description: [''],
      company_id: [''],
      branch_id: [''],
      isActive: [false]
    });
   }

  ngOnInit(): void {
      this.userData = this.serv.getUserData();
      if (this.userData.roles === 'Super Admin') {
        this.getAllCompanies();
      } else if (this.userData.roles === 'Company Admin') {
        this.form.patchValue({
          company_id: this.userData.company_id
        });
        this.getAllBranches();
      }else {
        this.form.patchValue({
          company_id: this.userData.company_id,
          branch_id: this.userData.branch_id
        });
      }

      if (this.categoryId) {
        this.getCategoriesDetails();
      }
  }
    getAllCompanies() {
        this.serv.endpoint = 'order-manager/company';
        this.serv.get().subscribe((data: any[]) => {
          this.companyList = data;
        });
    }

    getCategoriesDetails(){
        this.serv.endpoint = 'order-manager/category/' + this.categoryId;
        this.serv.get().subscribe((data: any) => {
          this.form.patchValue(data);

          this.getAllBranches();
          if (this.serv.notNull(data.featuredImage)){
            this.imageSrc = 'url(\'' + this.url + data.featuredImage + '\')';
          }
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
    this.imageSrc = 'url(\'' + imageSrc + '\')';
  }

  saveCategory(event= null) {
    if (event != null) {event.preventDefault(); }
    this.form.markAllAsTouched();
    if (this.form.invalid) {return; }
    const formValue = this.form.value;
    this.serv.endpoint = 'order-manager/category';
    this.serv.post(formValue).subscribe(response => {
      this.serv.showMessage('Category updated successfully', 'success');
      this.router.navigateByUrl('/admin/categories/list');
    }, ({error}) => {
      this.serv.showMessage(error.msg, 'error');
    });
  }

  getAllBranches() {
    if (this.userData.roles === 'Super Admin' || this.userData.roles === 'Company Admin') {
      this.serv.endpoint = 'order-manager/branch?fields=';
      this.serv.getByParam({
        fields: 'id,branchTitle',
        companyId: this.form.get('company_id').value
      }).subscribe(response => {
        this.branchList = response as any[];
      });
    }
  }

}
