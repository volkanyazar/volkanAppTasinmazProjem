import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasinmazUpdateComponent } from './tasinmaz-update.component';

describe('TasinmazUpdateComponent', () => {
  let component: TasinmazUpdateComponent;
  let fixture: ComponentFixture<TasinmazUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasinmazUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasinmazUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
