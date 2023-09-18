import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazAddComponent } from './tasinmaz-add.component';

describe('TasinmazAddComponent', () => {
  let component: TasinmazAddComponent;
  let fixture: ComponentFixture<TasinmazAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasinmazAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasinmazAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
