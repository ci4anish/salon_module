import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {SalonInfoService} from '../../services/salon-info.service';

@Component({
  selector: 'app-salon-services',
  templateUrl: './salon-services.component.html',
  styleUrls: ['./salon-services.component.scss']
})
export class SalonServicesComponent implements OnInit {
  serviceGroups;

  constructor(private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    combineLatest(
      this.salonDetailsService.getLocationGroupAll(3),
      this.salonDetailsService.getLocationServiceAll(3)
    ).subscribe(data => {
      this.serviceGroups = data[0];
      const serviceDescriptionArr = <any>data[1];

      this.serviceGroups.forEach(group => {
        group.services = group.services.map(service => {
          return serviceDescriptionArr.find(fullServiceInfo => fullServiceInfo.service.id === service.id);
        });
      });
    });
  }

}
