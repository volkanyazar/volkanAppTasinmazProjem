import { Component, OnInit, ElementRef } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import ScaleLine from 'ol/control/ScaleLine';
import { defaults as defaultControls } from 'ol/control';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Tasinmaz } from 'src/app/models/tasinmaz';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { toStringXY } from 'ol/coordinate';
import { TasinmazService } from 'src/app/services/tasinmaz.service';
import { CoordinateService } from 'src/app/services/coordinate-service.service';



@Component({
  selector: 'app-tasinmaz-map',
  templateUrl: './tasinmaz-map.component.html',
  styleUrls: ['./tasinmaz-map.component.css']
})
export class TasinmazMapComponent implements OnInit {
  map: Map;
  openStreetMapLayer: TileLayer;
  googleMapsLayer: TileLayer;
  vectorLayer: VectorLayer;
  vectorSource: VectorSource;

  constructor(private elementRef: ElementRef,private tasinmazService:TasinmazService,private coordinateService:CoordinateService) { }

  ngOnInit() {
    // OpenStreetMap kaynağını oluşturun
    const openStreetMapSource = new OSM();

    // Google Maps kaynağını oluşturun
    const googleMapsSource = new XYZ({
      url: 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
    });
    

    // OpenStreetMap katmanını oluşturun
    this.openStreetMapLayer = new TileLayer({
      source: openStreetMapSource,
      opacity: 1,
      visible: true,
    });

    // Google Maps katmanını oluşturun, ancak görünmez yapın
    this.googleMapsLayer = new TileLayer({
      source: googleMapsSource,
      opacity: 1,
      visible: false,
    });

    // Vektör kaynağını oluşturun
    this.vectorSource = new VectorSource();

    // Vektör katmanını oluşturun ve kaynağı ekleyin
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
    });
    this.tasinmazService.getCoordinates().subscribe(([coorX, coorY]) => {
      if (coorX !== null && coorY !== null) {
        this.markTasinmaz(coorX, coorY, this.vectorSource);
      }
    });
    // Türkiye'nin koordinatlarını kullanarak harita görünümünü tanımlayın ve zoom seviyesini artırın
    const view = new View({
      center: fromLonLat([35, 39]),
      zoom: 6,
      minZoom: 6,
      maxZoom: 18,
    });

    // Harita oluştur
    this.map = new Map({
      target: this.elementRef.nativeElement.querySelector('#map'),
      layers: [this.openStreetMapLayer, this.googleMapsLayer, this.vectorLayer], // Katmanları ekleyin
      view: view,
      controls: defaultControls().extend([new ScaleLine()])
    });
      // Haritaya tıklama olayını ekleyin
    this.map.on('click', (event) => {
      const coordinates = event.coordinate;
      const coordinateString = toStringXY(coordinates, 2); // Koordinatları formatlayın
      console.log('Tıklanan Koordinatlar:', coordinateString);
      this.coordinateService.setCoordinates(coordinates);
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
  

// Mark Tasinmaz işlevi
markTasinmaz(x: number, y: number, vectorSource: VectorSource) {
  const coordinates = fromLonLat([x, y]);
  const marker = new Feature({
    geometry: new Point(coordinates),
  });

  // İşaretleme stili ayarlayabilirsiniz
  marker.setStyle(new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: 'red' }),
      stroke: new Stroke({ color: 'black', width: 2 }),
    }),
  }));

  vectorSource.addFeature(marker);
}


}
