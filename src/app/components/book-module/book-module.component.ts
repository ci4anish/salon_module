import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {combineLatest} from 'rxjs';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {Professional} from '../../Interfaces/professional.interface';

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
  private selectedServiceGroup;
  private selectedServiceIndex;
  private salonId: number;

  constructor(private bookModuleService: BookModuleService,
              private route: ActivatedRoute,
              private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    this.salonId = +this.route.snapshot.queryParams.salonId;
    this.salonDetailsService.getSalonInfo(this.salonId)
      .subscribe((data: SalonInfo) => {
        this.salonName = data.name;
        this.salonAvatar = data.avatar;
      });
    combineLatest(
      this.salonDetailsService.getLocationGroupAll(this.salonId),
      this.salonDetailsService.getLocationServiceAll(this.salonId),
      this.salonDetailsService.getSalonProfessionals(this.salonId),
      this.salonDetailsService.getServices2professional(this.salonId),
      this.salonDetailsService.getProfessionals2services(this.salonId),
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

      const selectedServiceId = +this.route.snapshot.queryParams.serviceId;
      if (selectedServiceId) {
        this.findAndSelectService(selectedServiceId);
      }
    });
    // this.salonDetailsService.getAvailableHoursByProfessional(4)
    //   .subscribe( data => console.log(data));
    // problem with JSON object ? have mistake
  }

  findAndSelectService(selectedServiceId: number) {
    for (let i = 0; i < this.displayedServiceGroups.length; i++) {
      const groupItem = this.displayedServiceGroups[i];

      for (let j = 0; j < groupItem.services.length; j++) {
        const service = groupItem.services[j];
        if (selectedServiceId === service.service.id) {
          this.selectService(service, groupItem);
          return;
        }
      }
    }
  }

  getDisplayedServicesGroups(currentServices) {
    this.displayedServiceGroups = JSON.parse(JSON.stringify(this.serviceGroups));
    this.displayedServiceGroups.forEach(group => {
      const servicesIds = group.services;
      group.services = [];

      servicesIds.forEach(serviceId => {
        const service = currentServices.find(s => s.service.id === serviceId.id);
        if (service && (!this.selectedService || service.service.id !== this.selectedService.service.id)) {
          group.services.push(service);
        }
      });
    });
  }

  getDisplayedProfessionals() {
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
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

  selectService(service: any, group: any) {
    this.selectedService = service;
    this.selectedServiceIndex = group.services.indexOf(service);
    group.services.splice(this.selectedServiceIndex, 1);
    this.selectedServiceGroup = group;
    this.displayedProfessionals = this.services2professionalMap.get(service.id);
  }

  clearSelected() {
    const group = this.displayedServiceGroups.find(g => g.id === this.selectedServiceGroup.id);
    group.services.splice(this.selectedServiceIndex, 0, this.selectedService);
    this.selectedService = undefined;
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
  }
}
