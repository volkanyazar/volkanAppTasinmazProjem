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
  isMarked = false;
  allowMapMarking: boolean = true;
  allowTakeCoordinate:boolean = true;
  

  constructor(private elementRef: ElementRef, private tasinmazService: TasinmazService, private coordinateService: CoordinateService) { }
  markedTasinmazlar: Feature[] = [];
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
      style: new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: 'red' }), // İç dolgu rengi
          stroke: new Stroke({ color: 'white', width: 2 }), // Dış çizgi rengi
        }),
      }),
    });

    // Türkiye'nin koordinatlarını kullanarak harita görünümünü tanımlayın ve zoom seviyesini ayarlayın
    const view = new View({
      center: fromLonLat([35, 39]),
      zoom: 6,

    });

    // Harita oluştur
    this.map = new Map({
      target: this.elementRef.nativeElement.querySelector('#map'),
      layers: [this.openStreetMapLayer, this.googleMapsLayer, this.vectorLayer], // Katmanları ekleyin
      view: view,
      controls: defaultControls().extend([new ScaleLine()])
    });

// Haritaya tıklama olayını ekleyin
if(this.allowTakeCoordinate){
this.map.on('click', (event) => {
  const coordinates = event.coordinate;
  const coordinateString = toStringXY(coordinates, 2); // Koordinatları formatlayın
  console.log('Tıklanan Koordinatlar:', coordinateString);
  this.coordinateService.setCoordinates(coordinates);
  // Tıklama olayı gerçekleştiğinde işaretleme fonksiyonunu çağırın
  this.markTasinmazAtCoordinates(coordinates);
});
}
  // Harita katmanlarının görünürlüğünü izlemek için olay ekleyin
  this.openStreetMapLayer.on('change:visible', () => this.onLayerVisibilityChange());
  this.googleMapsLayer.on('change:visible', () => this.onLayerVisibilityChange());
  }
  onLayerVisibilityChange() {
    if (!this.openStreetMapLayer.getVisible() && !this.googleMapsLayer.getVisible()) {
      // Eğer her iki harita katmanı da görünmezse işaretlemeleri kaldır
      this.vectorSource.clear();
    } else if (this.openStreetMapLayer.getVisible() || this.googleMapsLayer.getVisible()) {
      // Eğer herhangi bir harita katmanı görünürse işaretlemeleri geri getir
      this.vectorSource.clear();
      this.vectorSource.addFeatures(this.markedTasinmazlar);
    }
  }
  toggleLayer(layer: TileLayer) {
    layer.setVisible(!layer.getVisible());
  }
  
  changeOpacity(layer: TileLayer) {
    const currentOpacity = layer.getOpacity();
    const newOpacity = currentOpacity === 1 ? 0.5 : 1;
    layer.setOpacity(newOpacity);
  }
  
  
  updateMapViewForCoordinates(coorX: number, coorY: number, zoomLevel: number) {
    this.map.getView().setCenter([coorX, coorY]);
    this.map.getView().setZoom(zoomLevel);
    console.log(coorX);
    console.log(coorY);
    console.log(5);


  }
  
  resetZoom() {
    const defaultZoom = 6; // Önceki zoom seviyesini burada tanımlayabilirsiniz
    const defaultCenter = fromLonLat([35, 39]); // Önceki merkez koordinatını burada tanımlayabilirsiniz
    this.map.getView().setCenter(defaultCenter);
    this.map.getView().setZoom(defaultZoom);
  }
  toggleMapMarking() {
    this.allowMapMarking = !this.allowMapMarking;
  }
  
  toggleTakeCoordinate() {
    this.allowTakeCoordinate = !this.allowTakeCoordinate;
  }
  markTasinmazAtCoordinates(coordinates: [number, number]) {
    if (this.allowMapMarking) {
    const marker = new Feature({
      geometry: new Point(coordinates),
    });

    // İşaretleme stili ayarlayabilirsiniz
    marker.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({ color: 'red' }), // İç dolgu rengi
        stroke: new Stroke({ color: 'white', width: 2 }), // Dış çizgi rengi
      }),
    }));

    // İşaretlenmiş taşınmazları listeye ekleyin
    this.markedTasinmazlar.push(marker);

    // Vektör kaynağına özellik ekleyin
    this.vectorSource.clear();
    this.vectorSource.addFeatures(this.markedTasinmazlar);
    }
  }
  unmarkTasinmazAtCoordinates(coorX: number, coorY: number) {
    // İşareti kaldırmak istediğiniz koordinatları kullanarak işareti bulun
    const index = this.markedTasinmazlar.findIndex((feature) => {
      const geometry = feature.getGeometry();
      const coordinates = geometry.getCoordinates();
      return coordinates[0] === coorX && coordinates[1] === coorY;
    });
  
    if (index !== -1) {
      // İşareti kaldırın ve markedTasinmazlar dizisinden çıkarın
      const removedFeature = this.markedTasinmazlar.splice(index, 1)[0];
      this.vectorSource.removeFeature(removedFeature);
    }
  }
  
  
}
