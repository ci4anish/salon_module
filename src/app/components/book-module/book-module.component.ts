import {Component, OnInit} from '@angular/core';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {combineLatest} from 'rxjs';


@Component({
  selector: 'app-book-module',
  templateUrl: './book-module.component.html',
  styleUrls: ['./book-module.component.scss']
})
export class BookModuleComponent implements OnInit {

  displayedServiceGroups;
  displayedProfessionals = [];

  private professionals2ServiceMap: Map<{}, [{}]> = new Map();
  private services2professionalMap: Map<{}, [{}]> = new Map();
  private serviceGroups;
  private salonProfessionals = <any>[];
  private salonServices = <any>[];

  constructor(private bookModuleService: BookModuleService,
              private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    combineLatest(
      // 1. todo get location info;
      this.salonDetailsService.getLocationGroupAll(3),
      this.salonDetailsService.getLocationServiceAll(3),
      this.salonDetailsService.getSalonProfessionals(3),
      this.salonDetailsService.getServices2professional(3),
      this.salonDetailsService.getProfessionals2services(3),
    ).subscribe(data => {
      this.serviceGroups = data[0];
      this.salonServices = data[1];
      this.salonProfessionals = data[2];

      const services2professional = <any[]>data[3];
      const professional2services = <any[]>data[4];

      professional2services.forEach(item => {
        item.services = item.services.map(service => {
          return this.salonServices.find(s => s.service.id === service.id);
        });
        item.professional = this.salonProfessionals.find(p => p.professional.id === item.professional.id);
        this.professionals2ServiceMap.set(item.professional, item.services);
      });

      services2professional.forEach(item => {
        item.professionals = item.professionals.map(professional => {
          return this.salonProfessionals.find(p => p.professional.id === professional.id);
        });
        item.service = this.salonServices.find(s => s.service.id === item.service.id);
        this.services2professionalMap.set(item.service, item.professionals);
      });

      console.log(this.services2professionalMap);
      console.log(this.professionals2ServiceMap);

      this.getDisplayedServicesGroups(this.salonServices);
    });


  }

  getDisplayedServicesGroups(currentServices) {
    this.displayedServiceGroups = Object.assign(this.serviceGroups); // todo deep copy
    this.displayedServiceGroups.forEach(group => {
      const servicesIds = group.services;
      group.services = [];

      servicesIds.forEach(serviceId => {
        const service = currentServices.find(s => s.service.id === serviceId.id);
        if (service) {
          group.services.push(service);
        }
      });
    });
  }


}
