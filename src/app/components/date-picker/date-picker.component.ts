import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
@ViewChild('picker') pickerElement: ElementRef;
  constructor() { }

  ngOnInit() {
    console.log(this.pickerElement)
  }
  log(event) {
    console.log(event)
  }
}
