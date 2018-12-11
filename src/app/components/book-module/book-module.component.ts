import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {Professional} from '../../Interfaces/professional.interface';
import {debounce, debounceTime, map, startWith} from 'rxjs/internal/operators';
import {FormControl} from '@angular/forms';
import {Service} from '../../Interfaces/service.interface';
import {MatListOption} from '@angular/material';

@Component({
  selector: 'app-book-module',
  templateUrl: './book-module.component.html',
  styleUrls: ['./book-module.component.scss']
})
export class BookModuleComponent implements OnInit {
  public selectedslotTime;
  public displayedServiceGroups;
  public displayedProfessionals;
  public selectedService: Service;
  public selectedProfessionalId;
  public salonName: string;
  public selectedProfessionalProfile: Professional;
  public salonAvatar;
  public professionalHours: {}[] = [];
  public searchControl: FormControl = new FormControl();
  public searchStr = '';
  public selectedHours: boolean;
  public selectedDateFromUser;
  public todayDay;
  public selectArrTimeSlot = [];
  public selectArrDate = [];


  private professionals2ServiceMap: Map<number, Service[]> = new Map();
  private services2professionalMap: Map<number, {}[]> = new Map();
  private serviceGroups;
  private salonProfessionals = <any>[];
  private salonServices = <any>[];
  private selectedServiceGroup;
  private selectedServiceIndex;
  private salonId: number;
  private formCtrlSub: Subscription;
  private selectedDay: string;

  constructor(private bookModuleService: BookModuleService,
              private route: ActivatedRoute,
              private salonDetailsService: SalonInfoService) {
  }

  ngOnInit() {
    this.todayDay = new Date();
    this.selectedHours = false;
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
        this.services2professionalMap.set(item.service.service.id, item.professionals);
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
    this.formCtrlSub = this.searchControl.valueChanges
      .pipe(debounceTime(600))
      .subscribe(filteringStr => this.sortServicesByTreatment(filteringStr));
  }

  private findAndSelectService(selectedServiceId: number) {
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

  private getDisplayedServicesGroups(currentServices) {
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

  private getDisplayedProfessionals() {
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
    this.selectedDay = '';
  }

  public selectProfessional(professionalId?) {
    if (professionalId !== undefined) {
      this.selectedDateFromUser = [];
      const masterServices = this.professionals2ServiceMap.get(professionalId);
      this.salonProfessionals.forEach(professional => {
        if (professional.id === professionalId) {
          this.selectedProfessionalProfile = professional;
          if (this.selectedDay !== '') {
            this.professionalHours = [];
            this.getProfessionalHours(professionalId, this.selectedDay);
          } else {
            this.professionalHours = [];
          }
        }
      });
      this.getDisplayedServicesGroups(masterServices);
    } else {
      this.getDisplayedServicesGroups(this.salonServices);
      this.selectedProfessionalProfile = undefined;
      this.professionalHours = [];
    }
  }

  public selectService(service: Service, group: any) {
    this.selectedService = service;
    console.log(this.selectedService);
    this.selectedServiceIndex = group.services.indexOf(service);
    group.services.splice(this.selectedServiceIndex, 1);
    this.selectedServiceGroup = group;
    this.displayedProfessionals = this.services2professionalMap.get(service.service.id);

  }

  public clearSelected() {
    const group = this.displayedServiceGroups.find(g => g.id === this.selectedServiceGroup.id);
    group.services.splice(this.selectedServiceIndex, 0, this.selectedService);
    this.selectedService = undefined;
    this.professionalHours = [];
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
    this.selectedDateFromUser = undefined;
    this.selectedslotTime = undefined;
    this.selectedDay = '';

  }

  private sortServicesByTreatment(value: string) {
    const filterValue = value.toLowerCase();
    if (this.selectedProfessionalProfile !== undefined) {
      let services = this.professionals2ServiceMap.get(this.selectedProfessionalProfile.id);
      services = services.filter((service: Service) => {
        if (service.service.name.toLowerCase().includes(filterValue)) {
          return service;
        }
      });
      this.getDisplayedServicesGroups(services);
    } else {
      let salonServices = JSON.parse(JSON.stringify(this.salonServices));
      salonServices = salonServices.filter(service => {
        if (service.service.name.toLowerCase().includes(filterValue)) {
          return service;
        }
      });
      this.getDisplayedServicesGroups(salonServices);
    }
  }

  public selectedDateInSchedule(e) {
    this.selectedslotTime = undefined;
    this.selectArrDate = [];
    const dateFromUser = new Date(e.value);
    const year = dateFromUser.getFullYear().toString().slice(-2);
    const month = dateFromUser.getMonth() + 1;

    let day = '';
    if (dateFromUser.getDate().toString().length === 1) {
      day = '0' + dateFromUser.getDate().toString();
    } else {
      day = dateFromUser.getDate().toString();
    }
    this.selectedDay = year + month + day;
    const viewData = dateFromUser.toDateString();
    this.selectedDateFromUser = {
      date: viewData.slice(7, 10),
      month: viewData.slice(3, 7),
      weekDay: viewData.slice(0, 3)
    };
    this.selectArrDate.push(year, month, day);

    this.getProfessionalHours(this.selectedProfessionalProfile.id, this.selectedDay);

  }

  private getProfessionalHours(professionalId, date) {
    this.salonDetailsService.getAvailableHoursByProfessional(professionalId, date)
      .subscribe(timeSlots => {
        const timeSlotsArr = [];
        for (const k in timeSlots) {
          if (timeSlots.hasOwnProperty(k)) {
            timeSlotsArr.push({time: k, availability: timeSlots[k]});
          }
        }
        const selectedTimeSlots = this.calcServiceTimeToTimeSlot(this.selectedService.service.minutes);
        this.professionalHours = this.getFilteredTimeSlots(timeSlotsArr, selectedTimeSlots)
          .map((k: { time: string, availability: string }) => {
            let date = new Date(+k.time).toTimeString();
            date = date.slice(0, 5);
            return {time: date, availability: k.availability, timeMS: k.time};
          });
        this.selectedHours = true;
        console.log(this.professionalHours);
      });
  }

  public selectTimeSlot(timeSlot) {
    this.selectedslotTime = timeSlot;
    const serviceMin = this.selectedService.service.minutes;
    const serviceDurationInMilliseconds = serviceMin * 60000;
    const endMilliseconds = +timeSlot.timeMS + serviceDurationInMilliseconds;
    this.selectArrTimeSlot.push(timeSlot.timeMS, endMilliseconds);
  }

  private calcServiceTimeToTimeSlot(duration) {
    return duration / 15;
  }

  private getFilteredTimeSlots(timeSlots, selectedSlotsCount): {}[] {
    const resultSlots = timeSlots.slice();
    let timeSlotsCount = resultSlots.length;
    let currentSlotCounter = 0;

    while (currentSlotCounter < timeSlotsCount) {
      const currentTimeSlot = resultSlots[currentSlotCounter];

      if (currentTimeSlot.availability === 'busy') {
        resultSlots.splice(currentSlotCounter, 1);
        timeSlotsCount--;
      } else {
        let nextStepTimeSlotCounter = currentSlotCounter + selectedSlotsCount - 1;
        if (nextStepTimeSlotCounter > resultSlots.length) {
          nextStepTimeSlotCounter = resultSlots.length;
        }
        for (let i = nextStepTimeSlotCounter; i > currentSlotCounter; i--) {
          if (i > (resultSlots.length - 1)) {
            i = (resultSlots.length - 1);
          }
          const timeSlot = resultSlots[i];
          if (timeSlot.availability === 'busy') {
            const deleteSlotsCount = i - currentSlotCounter + 1;
            resultSlots.splice(currentSlotCounter, deleteSlotsCount);
            timeSlotsCount -= deleteSlotsCount;
            break;
          }
        }
      }
      currentSlotCounter++;
    }
    return resultSlots;
  }

  public bookNow() {
    console.log(this.selectedslotTime)
    if (!!this.selectedProfessionalProfile && !!this.selectedService && !!this.selectedDateFromUser) {
      const bookObj = {
        timeFrame: {
          startTimeMS: +this.selectArrTimeSlot[0],
          endTimeMS: +this.selectArrTimeSlot[1]
        },
        status: 'PENDING',
        type: 'BOOKING',
        schedule: {
          // id: this.selectedProfessionalProfile.professional.id
          id: 4
        },
        creator: {
          id: 1
        },
        appUser: {
          id: 1
        },
        location: {id: 1},
        good: {
          goodsType: 'SERVICE_LOCATION',
          serviceLocation: {
            id: this.selectedService.service.id
          }
        },
      };
      // console.log(bookJson);
      // this.selectedService = undefined;
      // this.selectedProfessionalProfile = undefined;
      // this.selectArrDate = [];
      // this.selectArrTimeSlot = [];
      // this.selectProfessional(undefined);
      this.bookModuleService.bookNowService(bookObj)
        .subscribe(res => {
          console.log(res);
          this.selectedProfessionalProfile = undefined;
          this.selectedService  = undefined;
          this.selectedDateFromUser = [];
          this.selectProfessional(undefined);
          this.selectedProfessionalId = undefined;
          this.selectedDay = '';
        });
    }

  }
}





