import {Injectable} from '@angular/core';
import {apiUrl, tokenConst} from '../constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';

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
    return this.http.post(this.url + 'event', bookObj, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error?: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
