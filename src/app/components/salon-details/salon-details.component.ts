import {Component, OnInit} from '@angular/core';
import {SalonInfoService} from '../../services/salon-info.service';
import {SalonInfoInterface} from '../../Interfaces/salon-info';
import {AvailableHours} from '../../Interfaces/available-hours';
import {ProfessionalInteface} from '../../Interfaces/professional-inteface';
import {SalonGeo} from '../../Interfaces/salon-geo';
import {ReviewsInterface} from '../../Interfaces/reviews-interface';
import {combineLatest, Observable} from 'rxjs';

@Component({
  selector: 'app-salon-details',
  templateUrl: './salon-details.component.html',
  styleUrls: ['./salon-details.component.scss']
})
export class SalonDetailsComponent implements OnInit {
  salonName: string;
  address;
  descriptionOfSalon: string;
  phoneNumber: string;
  salon: number;
  professionalsBySalon: ProfessionalInteface;
  weekTimeFrame;
  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  salonGeo: SalonGeo;
  paymentMethods = [];
  distance;
  locationReviews: ReviewsInterface = <ReviewsInterface>{};

  constructor(private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    this.salon = 3;
    this.salonDetailsService.getSalonInfo()
      .subscribe((data: SalonInfoInterface) => {
        this.salonName = data.name;
        this.address = data.address.streetNameAndNumber + ', ' + data.address.city;
        this.descriptionOfSalon = data.longDescription;
        this.phoneNumber = data.phone.phone;
        this.paymentMethods = data.properties.paymentMethods;
      });

    this.salonDetailsService.getProfessionalsBySalon(this.salon)
      .subscribe((data: ProfessionalInteface) => {
        this.professionalsBySalon = data;
        // console.log(data);
      });

    this.salonDetailsService.getAvailabilityHours(this.salon)
      .subscribe((data: AvailableHours) => {
        const arrDate = data.weekTimeFrame;
        arrDate.forEach((day) => {
          day.weekDay = day.weekDay.toLowerCase();
          day.timeFrame.startTimeMS = new Date(day.timeFrame.startTimeMS).getHours();
          day.timeFrame.endTimeMS = new Date(day.timeFrame.endTimeMS).getHours();
          if (day.weekDay === this.days[new Date().getDay()]) {
            day.targetDay = true;
          }
        });
        this.weekTimeFrame = arrDate;
      });

    this.salonDetailsService.getReviewsLocation()
      .subscribe((data: ReviewsInterface) => {
        this.locationReviews = data;
      });

    this.getLocation();
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLong = position.coords.longitude;
        let salonLat;
        let salonLong;
        this.salonDetailsService.getGeoLocationSalon()
          .subscribe((data: SalonGeo) => {
            salonLat = data.deg.latitude;
            salonLong = data.deg.longitude;
            this.distance = this.calcDistance(userLat, userLong, salonLat, salonLong, 'K').toFixed(2);
          });
      });
    } else {
      alert('Geolocation error');
    }
  }

  private calcDistance(lat1, lon1, lat2, lon2, unit): number {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') {
        dist = dist * 1.609344;
      }
      if (unit === 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

}
