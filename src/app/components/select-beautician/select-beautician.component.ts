import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-select-beautician',
  templateUrl: './select-beautician.component.html',
  styleUrls: ['./select-beautician.component.scss']
})
export class SelectBeauticianComponent implements OnChanges {
  @Input() professionals;
  @Input() selectedId;

  @Output() selectProfessional: EventEmitter<number> = new EventEmitter();

  public disableSelectProfessionals = true;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.professionals.currentValue) {
      if (changes.professionals.currentValue.length > 0) {
        this.disableSelectProfessionals = false;
      }
    }
  }

  onSelect($event) {
    this.selectProfessional.emit($event.value);
  }

  clearInput() {
    this.selectedId = undefined;
    this.selectProfessional.emit(undefined);
  }


}
