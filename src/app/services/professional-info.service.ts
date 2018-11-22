import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable } from 'rxjs';
import { apiUrl } from '../constants/app.constants'
import { Professional } from '../Interfaces/professional.interface';



@Injectable({
  providedIn: 'root'
})
export class ProfessionalInfoService {

  constructor(private http: HttpClient) {
  }

  getProfessionalsByIds(ids: number[]): Observable<Professional[]> {
    return combineLatest(ids.map(id => this.getProfessionalsById(id)))
  }

  getProfessionalsById(id: number): Observable<Professional> {
    return this.http.get(apiUrl+ 'professional/' + id);
  }
}
