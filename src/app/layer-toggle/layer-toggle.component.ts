import { Component, Input } from '@angular/core';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-layer-toggle',
  templateUrl: './layer-toggle.component.html',
  styleUrls: ['./layer-toggle.component.css']
})
export class LayerToggleComponent {
  @Input() layerName: string;
  @Input() layer: TileLayer;

  get layerVisibility() {
    return this.layer.getVisible();
  }

  set layerVisibility(visible: boolean) {
    this.layer.setVisible(visible);
  }

  toggleLayer() {
    this.layerVisibility = !this.layerVisibility;
  }
}
