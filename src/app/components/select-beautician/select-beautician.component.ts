import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-select-beautician',
  templateUrl: './select-beautician.component.html',
  styleUrls: ['./select-beautician.component.scss']
})
export class SelectBeauticianComponent implements OnChanges {
  @Input() professionals;
  @Output() selectProfessional: EventEmitter<number> = new EventEmitter();
  @Input() selectedId;

  constructor() {
  }

  ngOnChanges(changes) {
    console.log(changes);
  }

  onSelect($event) {
    this.selectProfessional.emit($event.value);
  }

  clearInput() {
    this.selectProfessional.emit(undefined);
  }


}
