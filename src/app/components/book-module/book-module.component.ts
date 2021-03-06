import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Event} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {BookModuleService} from '../../services/book-module.service';
import {SalonInfoService} from '../../services/salon-info.service';
import {combineLatest, ReplaySubject} from 'rxjs';
import {SalonInfo} from '../../Interfaces/salon-info.interface';
import {Professional} from '../../Interfaces/professional.interface';
import {debounceTime, takeUntil} from 'rxjs/internal/operators';
import {FormControl} from '@angular/forms';
import {Service} from '../../Interfaces/service.interface';
import {timeZone, defaultProfessionalPhoto} from '../../constants';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';
import {throwError} from 'rxjs';
import {TimeSlotFiltered} from '../../Interfaces/time-slot-filtered';


@Component({
  selector: 'app-book-module',
  templateUrl: './book-module.component.html',
  styleUrls: ['./book-module.component.scss']
})
export class BookModuleComponent implements OnInit, OnDestroy {
  @ViewChild('professionalsSelect') professionalsSelect;

  public selectedSlotTime: any;
  public displayedServiceGroups;
  public displayedProfessionals;
  public selectedService: Service;
  public salonName: string;
  public selectedProfessionalProfile: Professional;
  public salonAvatar;
  public professionalHours: TimeSlotFiltered[] = [];
  public professionalHoursFiltered: TimeSlotFiltered[] = [];
  public searchControl: FormControl = new FormControl();
  public searchStr = '';
  public selectedHours: boolean;
  public selectedDateFromUser;
  public todayDay;
  public selectArrTimeSlot = [];
  public selectArrDate = [];
  public defaultProfessionalPhoto: string;

  private professionals2ServiceMap: Map<number, Service[]> = new Map();
  private services2professionalMap: Map<number, {}[]> = new Map();
  private serviceGroups;
  private salonProfessionals = <any>[];
  private salonServices = <any>[];
  private selectedServiceGroup;
  private selectedServiceIndex;
  public salonId: number;
  private selectedDay: string;
  private daysTimeFrame: any[];
  private userTimeZone: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private bookModuleService: BookModuleService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private salonDetailsService: SalonInfoService) {

    this.filterDaysDate = this.filterDaysDate.bind(this);
  }

  ngOnInit() {
    this.userTimeZone = timeZone;
    this.todayDay = new Date();
    this.selectedHours = false;
    this.defaultProfessionalPhoto = defaultProfessionalPhoto;
    this.salonId = +this.route.snapshot.params.locationId;
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


    this.searchControl.valueChanges
      .pipe(debounceTime(600), takeUntil(this.destroyed$))
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
      const masterServices = this.professionals2ServiceMap.get(professionalId);
      this.salonProfessionals.forEach(professional => {
        if (professional.id === professionalId) {
          this.selectedProfessionalProfile = professional;
          this.salonDetailsService.getAvailableDaysByProfessional(this.salonId, this.selectedProfessionalProfile.professional.id)
            .subscribe((res: any) => {
              this.daysTimeFrame = res.weekTimeFrame
                .map(item => {
                  item.weekDay = item.weekDay.slice(0, 3).toLowerCase();
                  return item;
                });
              const sun = this.daysTimeFrame.splice(-1, 1)[0];
              this.daysTimeFrame.unshift(sun);
            });

          this.professionalHours = [];
        }
      });
      this.getDisplayedServicesGroups(masterServices);
    } else {
      this.getDisplayedServicesGroups(this.salonServices);
      this.selectedProfessionalProfile = undefined;
      this.professionalHoursFiltered = [];
      this.professionalHours = [];
      if (this.selectedService) {
        this.clearSelected();
      }
    }
  }

  public filterDaysDate(d: Date): boolean {
    const day = d.getDay();
    const dayObj = this.daysTimeFrame[day];
    if (dayObj.timeFrame.startTimeMS !== dayObj.timeFrame.endTimeMS) {
      return true;
    } else {
      return false;
    }
    this.daysTimeFrame = [];
  }

  public selectService(service: Service, group: any) {
    this.selectedHours = false;
    this.selectedService = service;
    this.selectedServiceIndex = group.services.indexOf(service);
    group.services.splice(this.selectedServiceIndex, 1);
    this.selectedServiceGroup = group;
    this.displayedProfessionals = this.services2professionalMap.get(service.service.id);
    if (this.selectedProfessionalProfile !== undefined) {
      if (this.selectedProfessionalProfile.id && this.selectedDay && this.professionalHours.length > 0) {
        const calcServiceTimeToTimeSlot = this.calcServiceTimeToTimeSlot(this.selectedService.service.minutes);
        this.professionalHoursFiltered = this.getFilteredTimeSlots(this.professionalHours, calcServiceTimeToTimeSlot);
        if (this.selectedSlotTime) {
          const ind = this.professionalHoursFiltered.findIndex((slot: TimeSlotFiltered) => slot.time === this.selectedSlotTime.time);
          if (this.professionalHoursFiltered[ind].disableStatus !== true) {
            this.selectedSlotTime = this.professionalHoursFiltered[ind];
          } else {
            this.snackBar.open('This time slot is busy, please choose another slot', null, {
              duration: 5000,
            });
          }
        }
      }
    }
    if (this.selectedSlotTime) {
      this.setSelectArrTimeSlot();
    }
  }

  public clearSelected() {
    const group = this.displayedServiceGroups.find(g => g.id === this.selectedServiceGroup.id);
    group.services.splice(this.selectedServiceIndex, 0, this.selectedService);
    this.selectedService = undefined;
    this.selectedSlotTime = undefined;
    this.professionalHoursFiltered = this.professionalHours.slice();
    this.displayedProfessionals = JSON.parse(JSON.stringify(this.salonProfessionals));
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
    this.selectedSlotTime = undefined;
    this.selectArrDate = [];
    const dateFromUser = new Date(e.value);
    const year = dateFromUser.getFullYear().toString().slice(-2);
    const month = dateFromUser.getMonth() + 1;
    this.selectArrTimeSlot = [];

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
    this.getProfessionalHours(this.selectedProfessionalProfile.professional.id, this.selectedDay);
  }

  private getProfessionalHours(professionalId, dateFromUser) {
    this.professionalHours = [];
    this.salonDetailsService.getAvailableHoursByProfessional(professionalId, dateFromUser, this.userTimeZone)
      .subscribe(timeSlots => {
        const timeSlotsArr = [];
        for (const k in timeSlots) {
          if (timeSlots.hasOwnProperty(k)) {
            timeSlotsArr.push({time: k, availability: timeSlots[k]});
          }
        }

        this.professionalHours = timeSlotsArr
          .map((k: { time: string, availability: string, disableStatus: boolean }) => {
            const date = new Date(
              parseInt(20 + this.selectArrDate[0], 10),
              this.selectArrDate[1] - 1,
              parseInt(this.selectArrDate[2], 10));
            date.setMilliseconds(parseInt(k.time, 10));
            const dateStr = date.toTimeString().slice(0, 5);
            return {time: dateStr, availability: k.availability, timeMS: k.time, disableStatus: k.disableStatus};
          });

        if (this.selectedService) {
          const selectedTimeSlots = this.calcServiceTimeToTimeSlot(this.selectedService.service.minutes);
          this.professionalHoursFiltered = this.getFilteredTimeSlots(this.professionalHours, selectedTimeSlots);
        } else {
          this.professionalHoursFiltered = this.professionalHours.slice();
        }

        this.selectedHours = true;
      });


  }

  public selectTimeSlot(e, timeSlot) {
    if (timeSlot.availability === 'busy' || timeSlot.disableStatus) {
      e.preventDefault();
    } else {
      this.selectedSlotTime = timeSlot;
      if (this.selectedService) {
        this.setSelectArrTimeSlot();
      }
    }
  }

  private setSelectArrTimeSlot() {
    const serviceMin = this.selectedService.service.minutes;
    const serviceDurationInMilliseconds = serviceMin * 60000;
    const date = new Date(
      parseInt(20 + this.selectArrDate[0], 10),
      this.selectArrDate[1] - 1,
      parseInt(this.selectArrDate[2], 10));
    const startMsOfSelectedDateTimeSlot = date.getTime() + parseInt(this.selectedSlotTime.timeMS, 10);
    const endMsOfSelectedDateTimeSlot = startMsOfSelectedDateTimeSlot + serviceDurationInMilliseconds;
    this.selectArrTimeSlot = [startMsOfSelectedDateTimeSlot, endMsOfSelectedDateTimeSlot];
  }

  private calcServiceTimeToTimeSlot(duration) {
    return duration / 15;
  }

  private getFilteredTimeSlots(timeSlots, selectedSlotsCount): {}[] {
    const resultSlots = timeSlots.map(slot => Object.assign({}, slot));
    const timeSlotsCount = resultSlots.length;
    let currentSlotCounter = 0;

    while (currentSlotCounter < timeSlotsCount) {
      const currentTimeSlot = resultSlots[currentSlotCounter];
      if (currentTimeSlot.availability === 'busy') {
        // resultSlots.splice(currentSlotCounter, 1);
        // timeSlotsCount--;
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
            for (let j = i; j >= currentSlotCounter; j--) {
              if (!(resultSlots[j].availability === 'busy')) {
                resultSlots[j].disableStatus = true;
              }
            }
          }
        }
      }
      currentSlotCounter++;
    }
    const lastIndexOfResultSlots = resultSlots.length - 1;
    const startSelectedIndex = resultSlots.length - selectedSlotsCount;

    for (let f = lastIndexOfResultSlots; f > startSelectedIndex; f--) {
      if (resultSlots[f].availability !== 'busy' && resultSlots[f].status !== true) {
        resultSlots[f].disableStatus = true;
      }
    }
    return resultSlots;
  }

  public bookNow() {
    if (!!this.selectedProfessionalProfile && !!this.selectedService && !!this.selectedDateFromUser) {
      const bookObj = {
        timeFrame: {
          startTimeMS: +this.selectArrTimeSlot[0],
          endTimeMS: +this.selectArrTimeSlot[1]
        },
        status: 'PENDING',
        type: 'BOOKING',
        notes: 'test',
        schedule: {
          id: this.selectedProfessionalProfile.professional.id
        },
        creator: {
          id: 4
        },
        appUser: {
          id: 4
        },
        location: {id: this.salonId},
        good: {
          goodsType: 'SERVICE_LOCATION',
          serviceLocation: {
            id: this.selectedService.service.id
          }
        },
      };
      this.bookModuleService.bookNowService(bookObj)
        .pipe(
          catchError(this.handleError.bind(this))
        )
        .subscribe((res: any) => {
          alert('successful  ' + 'id: ' + res.id);
          this.selectedProfessionalProfile = undefined;
          this.selectedService = undefined;
          this.selectedDateFromUser = [];
          this.selectProfessional(undefined);
          this.professionalsSelect.setSelectedId(undefined);
          this.selectedDay = '';
          this.professionalHoursFiltered = undefined;
          this.selectArrDate = undefined;
          this.selectArrTimeSlot = undefined;
          this.selectedServiceGroup = undefined;
          this.selectedServiceIndex = undefined;
          this.selectedSlotTime = undefined;
          this.getDisplayedProfessionals();
        });
    }

  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private handleError(error?: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else if (error.status === 406) {
      console.error(error.error.msg);
      this.snackBar.open(error.error.msg, null, {
        duration: 2000,
      });
    } else {
      console.error(error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

}





