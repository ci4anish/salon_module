import {Component, OnInit, Output} from '@angular/core';
import {SalonInfoService} from '../../services/salon-info.service';
import {SalonGeo} from '../../Interfaces/salon-geo.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Output() salonGeoDeg;
  map;
  constructor(private salonService: SalonInfoService) {
  }

  ngOnInit() {
    this.salonService.getGeoLocationSalon(1).subscribe((data: SalonGeo) => {
      this.salonGeoDeg = data.deg;
      this.initMap();
    });
  }

  initMap() {
    this.map = new (<any>window).L.Map(document.getElementById('map'));
    const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const osmAttrib = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new (<any>window).L.TileLayer(osmUrl, {minZoom: 8, attribution: osmAttrib});
    this.map.setView(new (<any>window).L.LatLng(this.salonGeoDeg.latitude, this.salonGeoDeg.longitude), 14);
    this.map.addLayer(osm);
    const marker = (<any>window).L.marker([this.salonGeoDeg.latitude, this.salonGeoDeg.longitude]).addTo(this.map);
  }
}
