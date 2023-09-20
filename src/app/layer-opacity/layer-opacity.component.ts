import { TileLayer } from 'ol/layer/Tile';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layer-opacity',
  templateUrl: './layer-opacity.component.html',
  styleUrls: ['./layer-opacity.component.css']
})
export class LayerOpacityComponent {
  @Input() layerName: string;
  @Input() layer: TileLayer;

  get layerOpacity() {
    return this.layer.getOpacity();
  }

  set layerOpacity(opacity: number) {
    this.layer.setOpacity(opacity);
  }

  changeOpacity() {
    // Opaklık değiştiğinde yapılacak işlemler burada
  }
}
