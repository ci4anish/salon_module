import {Injectable} from '@angular/core';
import {apiUrl} from '../constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookModuleService {
  url = apiUrl;
  httpOptions;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' +
        'B6gHgYupV1jTo8tIKBGcsfEDo0zeE28SOYY5fVpskffd9/PsxOOAOLBj+OOFMROpEUjyhkhl/' +
        'DpnRn71NCWjoOEA7LX6oOx0P18s2jVcStkFN6EmbCJGFS7nSaVCSsOZHmjU4OBz7UBpZSJt6PIRuTIYi75FzDQxZhYIeCrL7iDvn/' +
        'Au9waUewpoO7oFnDLqYKgDuDxDpGpJv/lIQUMOlhBt4i5wkvKD/qCmgqlG8G2rkAKtwyCWB8BcBRUIQl2Vh50jWxDti3xP1Kk37v0P7yjRc2QKOG2+' +
        'uodIXb7Y3HIcOIGs3PmJwiv++tm2CiIyLKYJKLUzx3qwVe0zah5SziKmzXDMAsCjnDIDztp7iDz6SxzowzZCeFCm+6Z/DmeTFzhBwfr7lOdo4Kv1Px2PE/' +
        'UX4EOr1UIdi8levqxqSnoSsFIHRfFPKEklMBUbFEuE'
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
