import {Component, Input, OnInit} from '@angular/core';
import {defaultSalonAvatar} from '../../constants';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() salonAvatar;
  public defaultSalonAvatar = defaultSalonAvatar;

  constructor() {
  }

  ngOnInit() {
  }

}
