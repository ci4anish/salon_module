import {Component, ViewChild, Input} from '@angular/core';
import {NguCarouselConfig} from '@ngu/carousel';


@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  @Input() imageArr;
  @Input() salonId;
  name = 'Angular';
  slideNo = 0;
  withAnimation = true;
  resetAnimation = true;

  @ViewChild('myCarousel') myCarousel;
  carouselConfig: NguCarouselConfig = {
    grid: {xs: 1, sm: 1, md: 1, lg: 1, all: 0},
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: true,
    touch: true,
    velocity: 0.2,
    point: {
      hideOnSingleSlide: true,
      visible: true
    }
  };

  constructor() {
  }

  reset() {
    this.myCarousel.reset(!this.resetAnimation);
  }

  moveTo(slide) {
    this.myCarousel.moveTo(slide, !this.withAnimation);
  }
}
