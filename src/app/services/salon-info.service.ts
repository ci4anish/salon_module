import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {SalonGeo} from '../Interfaces/salon-geo.interface';
import {Observable, of} from 'rxjs';
import {AvailableHours} from '../Interfaces/available-hours.interface';
import {Professional} from '../Interfaces/professional.interface';
import {apiUrl, mock} from '../constants';


@Injectable({
  providedIn: 'root'
})
export class SalonInfoService {
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

  getSalonInfo(salonId: number): any {
    return this.http.get(this.url + 'location/' + salonId, this.httpOptions);
  }

  getSalonProfessionals(salonId: number): Observable<Professional> {
    return this.http.get<Professional>(this.url + 'location/' + salonId + '/professionals ');
  }

  getAvailableHoursByProfessional(professionalId: number, dateSelect: string, timeZone: string) {
    //   return this.http.get(this.url + 'schedule/professional/' + professionalId + '/yymmdd/' + dateSelect + '/timezone/' + timeZone +
    //     '/merged' + '?includeAvailabilityHours=true', this.httpOptions);

    // }
    return of(mock)
  }
  getAvailableDaysByProfessional(salonId: number, professionalId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/professional/' + professionalId + '/availabilityhours', this.httpOptions);
  }

  getAvailabilityHours(salonId: number): Observable<AvailableHours> {
    return this.http.get<AvailableHours>(this.url + 'availabilityhours/' + salonId);
  }

  getGeoLocationSalon(salonId: number): Observable<SalonGeo> {
    return this.http.get<SalonGeo>(this.url + 'location/' + salonId + '/geo');
  }

  getLocationGroupAll(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/group/all');
  }

  getLocationReviews(salonId: number) {
    return this.http.get(this.url + 'location/' + salonId + '/reviews?limit=3');
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
