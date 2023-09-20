import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import view from 'ol/view';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';

import ScaleLine from 'ol/control/ScaleLine';

@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css']
})
export class TasinmazMapComponent implements OnInit {
  map: Map;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = new Map({
      target: 'map', // HTML'deki bir div elementi
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          }),
          opacity: 1, // Başlangıçta tamamen görünür
          visible: true // Başlangıçta görünür
        }),
      ],
      view: new view({
        center: [0, 0],
        zoom: 2
      }),
      controls: [
        new ScaleLine() // Harita ölçek bilgisi
      ]
    });
  }

}
