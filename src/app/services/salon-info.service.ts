import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SalonGeo} from '../Interfaces/salon-geo.interface';
import {Observable} from 'rxjs';
import {AvailableHours} from '../Interfaces/available-hours.interface';
import {Professional} from '../Interfaces/professional.interface';

@Injectable({
  providedIn: 'root'
})
export class SalonInfoService {
  url = 'https://3.120.139.153:32443/ciu-rest/';

  constructor(private http: HttpClient) {
  }

  getSalonInfo(salon: number): any {
    return this.http.get(this.url + 'location/' + salon);
  }


  getProfessionalsBySalon(salon: number): Observable<Professional> {
    return this.http.get<Professional>(this.url + 'location/' + salon + '/professionals ');
  }

  // getAdminsBySalon(salon: number): any {
  //   return this.http.get(this.url + salon + '/admins ');
  // }
  //
  // getUser(salon: number) {
  //
  // }

  getAvailabilityHours(salon: number): Observable<AvailableHours> {
    return this.http.get<AvailableHours>(this.url + 'availabilityhours/' + salon);
  }

  getGeoLocationSalon(salon?: number): Observable<SalonGeo> {

    // location #3 hasn't response to geo
    // i'm using location #1 , because it has response

    return this.http.get<SalonGeo>(this.url + 'location/' + salon + '/geo');
  }

  getLocationGroupAll(salon?: number) {
    return this.http.get(this.url + 'location/' + salon + '/group/all');
  }

  getLocationReviews(salon: number) {
    return this.http.get(this.url + 'location/' + salon + '/reviews');
  }

  getLocationServiceAll(salon: number) {
    return this.http.get(this.url + 'location/' + salon + '/service/all/location');
  }
}
