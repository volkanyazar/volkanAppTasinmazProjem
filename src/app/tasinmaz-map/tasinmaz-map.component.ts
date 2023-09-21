import { Component, OnInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import ScaleLine from 'ol/control/ScaleLine';
import { defaults as defaultControls } from 'ol/control';

@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css']
})
export class TasinmazMapComponent implements OnInit {
  map: Map;
  openStreetMapLayer: TileLayer;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    // Harita özelliklerini tanımlayın
    this.openStreetMapLayer = new TileLayer({
      source: new OSM(),
      opacity: 1,
      visible: true
    });

    // Türkiye'nin koordinatlarını kullanarak harita görünümünü tanımlayın ve zoom seviyesini artırın
    const view = new View({
      center: fromLonLat([35, 39]), // Türkiye'nin koordinatları (boylam, enlem)
      zoom: 6, // İstediğiniz başlangıç yakınlaştırma seviyesini ayarlayabilirsiniz
      minZoom: 6,
      maxZoom: 18,
    });

    // Harita oluştur
    this.map = new Map({
      target: this.elementRef.nativeElement.querySelector('#map'),
      layers: [this.openStreetMapLayer],
      view: view,
      controls: defaultControls().extend([new ScaleLine()])
    });

    // Harita görünümünü sınırla
    view.fit([26.0, 46.0, 45.0, 42.0], this.map.getSize()); // Türkiye sınırları
  }

  toggleLayer(layer: TileLayer) {
    layer.setVisible(!layer.getVisible());
  }

  changeOpacity(layer: TileLayer) {
    const currentOpacity = layer.getOpacity();
    const newOpacity = currentOpacity === 1 ? 0.5 : 1;
    layer.setOpacity(newOpacity);
  }
}
