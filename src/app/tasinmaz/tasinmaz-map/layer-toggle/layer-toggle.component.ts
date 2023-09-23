import { Component, Input, Output, EventEmitter } from '@angular/core';
import TileLayer from 'ol/layer/tile';

@Component({
  selector: 'app-layer-toggle',
  template: `
    <div class="layer-name">{{ layerName }}</div>
    <div class="layer-visibility">
      <input type="checkbox" [checked]="layerVisibility" (change)="toggleLayer()" />
    </div>
  `,
  styleUrls: ['./layer-toggle.component.css']
})
export class LayerToggleComponent {
  @Input() layerName: string;
  @Input() layer: TileLayer;
  @Output() layerVisibilityChanged = new EventEmitter<boolean>();

  get layerVisibility() {
    return this.layer.getVisible();
  }

  toggleLayer() {
    this.layer.setVisible(!this.layerVisibility);
    this.layerVisibilityChanged.emit(this.layerVisibility);
  }
}
