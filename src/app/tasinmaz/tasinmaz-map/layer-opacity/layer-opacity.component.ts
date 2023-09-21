import { Component, Input } from '@angular/core';
import TileLayer from 'ol/layer/tile';

@Component({
  selector: 'app-layer-opacity',
  template: `
    <div class="layer-container">
      <div class="layer-name">{{ layerName }}</div>
      <div class="layer-opacity">
        <input type="range" [(ngModel)]="layerOpacity" (input)="changeOpacity()" min="0" max="1" step="0.01" />
      </div>
    </div>
  `,
  styleUrls: ['./layer-opacity.component.css'] // CSS dosyasını ekledik
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
