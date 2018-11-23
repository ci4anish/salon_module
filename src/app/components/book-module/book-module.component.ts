import {Component, OnInit} from '@angular/core';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {ProfessionalInfoService} from '../../services/professional-info.service';
import {Professional} from '../../Interfaces/professional.interface';
import {combineLatest} from 'rxjs';


@Component({
  selector: 'app-book-module',
  templateUrl: './book-module.component.html',
  styleUrls: ['./book-module.component.scss']
})
export class BookModuleComponent implements OnInit {

  serviceGroups;

  constructor(private bookModuleService: BookModuleService,
              private salonDetailsService: SalonInfoService,
              private professionalInfoService: ProfessionalInfoService) {
  }

  ngOnInit() {
    this.salonDetailsService.getProfessionalsBySalon(3)
      .subscribe((data: Professional) => {
        console.log('Professionals', data);
      });

    this.salonDetailsService.getServices2professional(3)
      .subscribe(data => console.log('services2professionals', data));
    this.salonDetailsService.getProfessionals2services(3)
      .subscribe(data => console.log('professionals2services', data));

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

      console.log('Service Groups', this.serviceGroups);

      // get professionals by service
      this.getProfessionalsByService(this.serviceGroups[0].services[0]);
    });
  }

  getProfessionalsByService(service) {
    this.professionalInfoService.getProfessionalsByIds(service.professionals.map(p => p.id)).subscribe((professional: Professional[]) => {
      console.log('getProfessionalsByService', service, professional);
    });
  }

}
