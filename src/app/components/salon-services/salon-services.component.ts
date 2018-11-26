import {Component, OnInit} from '@angular/core';
import {combineLatest} from 'rxjs';
import {SalonInfoService} from '../../services/salon-info.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-salon-services',
  templateUrl: './salon-services.component.html',
  styleUrls: ['./salon-services.component.scss']
})
export class SalonServicesComponent implements OnInit {
  serviceGroups;
  salonId;
  constructor(private salonDetailsService: SalonInfoService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.salonId = parseInt((<any>this.route.snapshot.params).id, 10);

    combineLatest(
      this.salonDetailsService.getLocationGroupAll(this.salonId),
      this.salonDetailsService.getLocationServiceAll(this.salonId)
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
