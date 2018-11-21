import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProfessionalInteface} from '../Interfaces/professional-inteface';
import {SalonGeo} from '../Interfaces/salon-geo';
import {Observable} from 'rxjs';
import {AvailableHours} from '../Interfaces/available-hours';

@Injectable({
  providedIn: 'root'
})
export class SalonInfoService {

  constructor(private http: HttpClient) {
  }

  urlSalonInfo = 'https://3.120.139.153:32443/ciu-rest/location/3';
  urlProfessionalsBySalon = 'https://3.120.139.153:32443/ciu-rest/location/';
  urlAvailabilityHours = 'https://www.cutitup.it:32443/ciu-rest/availabilityhours/12';
  urlImgApi = 'https://3.120.139.153:32443/ciu-rest/image/';

  getSalonInfo(): any {
    return this.http.get(this.urlSalonInfo);
  }

  getImg(id: number) {
    return this.http.get(this.urlImgApi + id);
  }

  getProfessionalsBySalon(salon: number): Observable<ProfessionalInteface> {
    return this.http.get<ProfessionalInteface>(this.urlProfessionalsBySalon + salon + '/professionals ');
  }

  getAdminsBySalon(salon: number): any {
    return this.http.get(this.urlProfessionalsBySalon + salon + '/admins ');
  }

  getUser(salon: number) {

  }

  getAvailabilityHours(salon: number): Observable<AvailableHours> {
    return this.http.get<AvailableHours>(this.urlAvailabilityHours);
  }

  getGeoLocationSalon(salon?: number): Observable<SalonGeo> {

    // location #3 hasn't response to geo
    // i'm using location #1 , because it has response

    return this.http.get<SalonGeo>('https://3.120.139.153:32443/ciu-rest/location/2/geo');
  }

  getLocationGroupAll(salon?: number) {
    return this.http.get('https://3.120.139.153:32443/ciu-rest/location/3/group/all');
  }

  getLocationReviews() {
    return this.http.get('https://3.120.139.153:32443/ciu-rest/location/3/reviews');
  }

  getLocationServiceAll(){
    return this.http.get('https://3.120.139.153:32443/ciu-rest/location/3/service/all/location');
  }
}
