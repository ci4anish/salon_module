import { Injectable } from '@angular/core';
import { apiUrl, tokenConst } from '../constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookModuleService {
  url = apiUrl;
  token = tokenConst;
  httpOptions;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.token
      })
    };
  }

  bookNowService(bookObj) {
    return this.http.post(this.url + 'event', bookObj, this.httpOptions);
  }
}
