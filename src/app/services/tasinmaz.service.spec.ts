import { TestBed } from '@angular/core/testing';

import { TasinmazService } from './tasinmaz.service';

describe('TasinmazService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TasinmazService = TestBed.get(TasinmazService);
    expect(service).toBeTruthy();
  });
});
