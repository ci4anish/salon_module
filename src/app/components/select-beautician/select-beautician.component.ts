import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-select-beautician',
  templateUrl: './select-beautician.component.html',
  styleUrls: ['./select-beautician.component.scss']
})
export class SelectBeauticianComponent implements OnInit {
  constructor() {
  }
  @Input() beauticians;

  ngOnInit() {
  }

}
