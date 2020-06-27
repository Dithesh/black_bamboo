import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = environment.apiUrl;
  endpoint = "";
  constructor(private http: HttpClient) { }

  get() {
    return this.http.get(this.apiUrl + this.endpoint);
  }

  post(data) {
    return this.http.post(this.apiUrl + this.endpoint, data);
  }

  put(data) {
    return this.http.put(this.apiUrl + this.endpoint, data);
  }

  delete() {
    return this.http.delete(this.apiUrl + this.endpoint);
  }
}
