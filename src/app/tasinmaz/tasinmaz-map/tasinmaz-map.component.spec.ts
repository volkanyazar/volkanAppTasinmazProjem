import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazMapComponent } from './tasinmaz-map.component';

describe('TasinmazMapComponent', () => {
  let component: TasinmazMapComponent;
  let fixture: ComponentFixture<TasinmazMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasinmazMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasinmazMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
