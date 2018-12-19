import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SalonInfoService} from '../../services/salon-info.service';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {AvailableHours} from '../../Interfaces/available-hours.interface';
import {SalonGeo} from '../../Interfaces/salon-geo.interface';
import {Review} from '../../Interfaces/review.interface';
import {Portfolio} from '../../Interfaces/portfolio.interface';
import {amenities, payments, socialLinks, defaultSalonDescription, defaultProfessionalPhoto} from '../../constants';

@Component({
  selector: 'app-salon-details',
  templateUrl: './salon-details.component.html',
  styleUrls: ['./salon-details.component.scss']
})
export class SalonDetailsComponent implements OnInit {
  public salonGeoDeg;
  salonName: string;
  address;
  descriptionOfSalon: string;
  phoneNumber: string;
  salonId: number;
  professionalsBySalon = [];
  weekTimeFrame;
  days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  paymentMethods = [];
  distance: string;
  locationReviews: Review = <Review>{};
  salonData: SalonInfo;
  portfolioImg = [];
  languages = <any>[];
  salonAmenities;
  salonSocialLinks = [];
  amenities = amenities;
  socialLinks = socialLinks;
  payments = payments;
  salonAvatar;
  defaultProfessionalPhoto = defaultProfessionalPhoto;
  defaultSalonDescription = defaultSalonDescription;

  public static calcDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string): number {
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

  constructor(private salonDetailsService: SalonInfoService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.salonId = parseInt((<any>this.route.snapshot.params).id, 10);
    this.salonDetailsService.getSalonInfo(this.salonId)
      .subscribe((data: SalonInfo) => {
        this.salonAvatar = data.avatar;
        this.salonData = data;
        this.salonName = data.name;
        this.address = data.address.streetNameAndNumber + ', ' + data.address.city;
        this.descriptionOfSalon = data.longDescription;
        this.phoneNumber = data.phone.phone;
        this.paymentMethods = data.properties.paymentMethods;
        this.languages = data.properties.otherLanguages;
        this.languages.unshift(data.properties.mainLanguage);
        this.salonSocialLinks = data.socialMediaLinks;
        this.salonAmenities = data.properties.amenities.map(amenity => {
          return amenity.toLowerCase().replace(/_/g, ' ');
        });
      });

    this.salonDetailsService.getSalonProfessionals(this.salonId)
      .subscribe((data: any) => {
        this.professionalsBySalon = data;
      });

    this.salonDetailsService.getAvailabilityHours(this.salonId)
      .subscribe((data: AvailableHours) => {
        const arrDate = data.weekTimeFrame;
        arrDate.forEach((day) => {
          day.weekDay = day.weekDay.toLowerCase();
          if (day.timeFrame.startTimeMS === day.timeFrame.endTimeMS) {
            day.timeFrame.startTimeMS = 'Closed';
            day.timeFrame.endTimeMS = undefined;
            day.closeDay = true;
          } else {
            day.timeFrame.startTimeMS =
              this.convertTime(new Date(day.timeFrame.startTimeMS).getHours().toString()) + ':' +
              this.convertTime(new Date(day.timeFrame.startTimeMS).getMinutes().toString()) + ' - ';
            day.timeFrame.endTimeMS =
              this.convertTime(new Date(day.timeFrame.endTimeMS).getHours().toString()) + ':' +
              this.convertTime(new Date(day.timeFrame.endTimeMS).getMinutes().toString());
          }
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
        if (data !== null) {
          this.portfolioImg = data.image;
        }
      });

    this.getLocation();
  }

  private convertTime(time: string): string {
    return time.length > 1 ? time : '0' + time;
  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLong = position.coords.longitude;
        let salonLat;
        let salonLong;
        this.salonDetailsService.getGeoLocationSalon(this.salonId)
          .subscribe((data: SalonGeo) => {
            if (data) {
              this.salonGeoDeg = data.deg;
              salonLat = data.deg.latitude;
              salonLong = data.deg.longitude;
              this.distance = SalonDetailsComponent.calcDistance(userLat, userLong, salonLat, salonLong, 'K').toFixed(2);
            }
          });
      });
    } else {
      console.error('Geolocation error');
    }
  }

}
