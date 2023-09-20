import { Component, Input } from '@angular/core';
import TileLayer from 'ol/layer/tile';

@Component({
  selector: 'app-layer-toggle',
  template: `
    <label>{{ layerName }}</label>
    <input type="checkbox" [checked]="layerVisibility" (click)="toggleLayer()" />
  `,
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
