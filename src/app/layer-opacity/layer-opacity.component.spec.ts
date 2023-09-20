import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayerOpacityComponent } from './layer-opacity.component';

describe('LayerOpacityComponent', () => {
  let component: LayerOpacityComponent;
  let fixture: ComponentFixture<LayerOpacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayerOpacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerOpacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
