import { TestBed } from '@angular/core/testing';

import { JwtConfigService } from './jwt-config.service';

describe('JwtConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtConfigService = TestBed.get(JwtConfigService);
    expect(service).toBeTruthy();
  });
});
