import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SalonGeo} from '../Interfaces/salon-geo.interface';
import {Observable} from 'rxjs';
import {AvailableHours} from '../Interfaces/available-hours.interface';
import {Professional} from '../Interfaces/professional.interface';
import {apiUrl} from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class SalonInfoService {
  url = apiUrl;

  constructor(private http: HttpClient) {
  }

  getSalonInfo(salon: number): any {
    return this.http.get(this.url + 'location/' + salon);
  }


  getSalonProfessionals(salonId: number): Observable<Professional> {
    return this.http.get<Professional>(this.url + 'location/' + salonId + '/professionals ');
  }

  // getAdminsBySalon(salon: number): any {
  //   return this.http.get(this.url + salon + '/admins ');
  // }
  //
  // getUser(salon: number) {
  //
  // }

  getAvailabilityHours(salonId: number): Observable<AvailableHours> {
    return this.http.get<AvailableHours>(this.url + 'availabilityhours/' + salonId);
  }

  getGeoLocationSalon(salonId?: number): Observable<SalonGeo> {

    // location #3 hasn't response to geo
    // i'm using location #1 , because it has response

    return this.http.get<SalonGeo>(this.url + 'location/' + salonId + '/geo');
  }

  getLocationGroupAll(salonId?: number) {
    return this.http.get(this.url + 'location/' + salonId + '/group/all');
  }

  getLocationReviews(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/reviews');
  }

  getLocationServiceAll(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/service/all/location');
  }

  getLocationPortfolio(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/portfolio');
  }

  getServices2professional(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/services2professionals');
  }

  getProfessionals2services(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/professionals2services');
  }
}
