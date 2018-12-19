import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SalonInfoService} from '../../services/salon-info.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnChanges {
  @Input() salonGeoDeg;

  public showMap = false;
  public map;

  constructor(private salonService: SalonInfoService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.salonGeoDeg.currentValue) {
      this.showMap = true;
      setTimeout(() => {
        this.initMap(changes.salonGeoDeg.currentValue);
      });
    } else {
      this.showMap = false;
    }
  }

  initMap(salonGeoDeg) {
    this.map = new (<any>window).L.Map(document.getElementById('map'));
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new (<any>window).L.TileLayer(osmUrl, {minZoom: 8, attribution: osmAttrib});
    this.map.setView(new (<any>window).L.LatLng(salonGeoDeg.latitude, salonGeoDeg.longitude), 14);
    this.map.addLayer(osm);
    const marker = (<any>window).L.marker([salonGeoDeg.latitude, salonGeoDeg.longitude]).addTo(this.map);
  }
}
