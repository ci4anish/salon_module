import {Component, OnInit} from '@angular/core';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {combineLatest} from 'rxjs';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {Professional} from '../../Interfaces/professional.interface';
import {group} from '@angular/animations';


@Component({
  selector: 'app-book-module',
  templateUrl: './book-module.component.html',
  styleUrls: ['./book-module.component.scss']
})
export class BookModuleComponent implements OnInit {

  public displayedServiceGroups;
  public displayedProfessionals;
  public selectedService;
  public selectedProfessionalId;
  public salonName: string;
  public selectedProfessionalProfile: Professional;
  public availableHours;
  public salonAvatar;

  private professionals2ServiceMap: Map<number, [{}]> = new Map();
  private services2professionalMap: Map<number, [{}]> = new Map();
  private serviceGroups;
  private salonProfessionals = <any>[];
  private salonServices = <any>[];
  private group;
  private index;

  constructor(private bookModuleService: BookModuleService,
              private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    this.salonDetailsService.getSalonInfo(3)
      .subscribe((data: SalonInfo) => {
        this.salonName = data.name;
        this.salonAvatar = data.avatar;
      });
    combineLatest(
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
        this.professionals2ServiceMap.set(item.professional.id, item.services);
      });

      services2professional.forEach(item => {
        item.professionals = item.professionals.map(professional => {
          return this.salonProfessionals.find(p => p.professional.id === professional.id);
        });
        item.service = this.salonServices.find(s => s.service.id === item.service.id);
        this.services2professionalMap.set(item.service.id, item.professionals);
      });
      this.getDisplayedServicesGroups(this.salonServices);
      this.getDisplayedProfessionals();
    });
    // this.salonDetailsService.getAvailableHoursByProfessional(4)
    //   .subscribe( data => console.log(data));
    // problem with JSON object ? have mistake
  }

  getDisplayedServicesGroups(currentServices) {
    this.displayedServiceGroups = JSON.parse(JSON.stringify(this.serviceGroups));
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

  getDisplayedProfessionals() {
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
    // this.selectedProfessionalId = this.displayedProfessionals[0].id;
  }

  selectProfessional(professionalId?) {
    if (professionalId !== undefined) {
      const masterServices = this.professionals2ServiceMap.get(professionalId);
      this.salonProfessionals.forEach(professional => {
        if (professional.id === professionalId) {
          this.selectedProfessionalProfile = professional;
          console.log(professional);
        }
      });
      this.getDisplayedServicesGroups(masterServices);
    } else {
      this.getDisplayedServicesGroups(this.salonServices);
      this.selectedProfessionalProfile = undefined;
    }
  }

  selectService(service: any, groupServices: any) {
    this.selectedService = service;
    this.index = groupServices.indexOf(service);
    groupServices.splice(this.index, 1);
    this.group = groupServices;
    this.displayedProfessionals = this.services2professionalMap.get(service.id);
  }

  removeSelect(service) {
    this.group.splice(this.index, 0, service);
    this.selectedService = undefined;
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
  }

}
