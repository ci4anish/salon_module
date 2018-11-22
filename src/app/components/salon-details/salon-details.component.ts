import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SalonInfoService} from '../../services/salon-info.service';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {AvailableHours} from '../../Interfaces/available-hours.interface';
import {Professional} from '../../Interfaces/professional.interface';
import {SalonGeo} from '../../Interfaces/salon-geo.interface';
import {Review} from '../../Interfaces/review.interface';
import {Portfolio} from '../../Interfaces/portfolio.interface';

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
  salonId: number;
  professionalsBySalon: Professional;
  weekTimeFrame;
  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  paymentMethods = [];
  distance;
  locationReviews: Review = <Review>{};
  salonData: SalonInfo;
  portfolioImg = [];

  constructor(private salonDetailsService: SalonInfoService, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.salonId = parseInt((<any>this.route.snapshot.params).id);
    this.salonDetailsService.getSalonInfo(this.salonId)
      .subscribe((data: SalonInfo) => {
        console.log(data);
        this.salonData = data;
        this.salonName = data.name;
        this.address = data.address.streetNameAndNumber + ', ' + data.address.city;
        this.descriptionOfSalon = data.longDescription;
        this.phoneNumber = data.phone.phone;
        this.paymentMethods = data.properties.paymentMethods;
      });

    this.salonDetailsService.getProfessionalsBySalon(this.salonId)
      .subscribe((data: Professional) => {
        this.professionalsBySalon = data;
      });

    this.salonDetailsService.getAvailabilityHours(12)
      .subscribe((data: AvailableHours) => {
        const arrDate = data.weekTimeFrame;
        arrDate.forEach((day) => {
          day.weekDay = day.weekDay.toLowerCase();
          day.timeFrame.startTimeMS = new Date(day.timeFrame.startTimeMS).getHours() + ':' +
            new Date(day.timeFrame.startTimeMS).getMinutes();
          day.timeFrame.endTimeMS = new Date(day.timeFrame.endTimeMS).getHours() + ':' +
            new Date(day.timeFrame.endTimeMS).getMinutes();
          if (day.weekDay === this.days[new Date().getDay()]) {
            day.targetDay = true;
          }
        });
        this.weekTimeFrame = arrDate;
      });

    this.salonDetailsService.getLocationReviews(this.salonId)
      .subscribe((data: Review) => {
        this.locationReviews = data;
      });

    this.salonDetailsService.getLocationPortfolio(this.salonId)
      .subscribe((data: Portfolio) => {
        this.portfolioImg = data.image;
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
        this.salonDetailsService.getGeoLocationSalon(1)
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
