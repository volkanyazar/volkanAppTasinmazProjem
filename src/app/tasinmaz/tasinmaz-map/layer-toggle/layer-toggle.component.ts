import { Component, Input } from '@angular/core';
import TileLayer from 'ol/layer/tile';

@Component({
  selector: 'app-layer-toggle',
  template: `
    <div class="layer-name">{{ layerName }}</div>
    <div class="layer-visibility">
      <input type="checkbox" [checked]="layerVisibility" (click)="toggleLayer()" />
    </div>
  `,
  styleUrls: ['./layer-toggle.component.css'] // CSS dosyasını ekledik
})
export class LayerToggleComponent {
  @Input() layerName: string;
  @Input() layer: TileLayer;

  get layerVisibility() {
    return this.layer.getVisible();
  }

  toggleLayer() {
    this.layer.setVisible(!this.layerVisibility);
  }
}
