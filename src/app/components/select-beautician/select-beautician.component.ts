import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'app-select-beautician',
  templateUrl: './select-beautician.component.html',
  styleUrls: ['./select-beautician.component.scss']
})
export class SelectBeauticianComponent  {
  @Input() professionals;
  @Output() selectProfessional: EventEmitter<number> = new EventEmitter();
  @Input() selectedId;

  constructor() {
  }

  onSelect($event) {
    this.selectProfessional.emit($event.value);
  }

  clearInput() {
    this.selectedId = undefined;
    this.selectProfessional.emit(undefined);
  }


}
