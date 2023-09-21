import { Component, Input } from '@angular/core';
import TileLayer from 'ol/layer/tile';

@Component({
  selector: 'app-layer-opacity',
  template: `
    <label>{{ layerName }}</label>
    <input type="range" [(ngModel)]="layerOpacity" (input)="changeOpacity()" min="0" max="1" step="0.01" />
  `,
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
