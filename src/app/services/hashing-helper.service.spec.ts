import { TestBed } from '@angular/core/testing';

import { HashingHelperService } from './hashing-helper.service';

describe('HashingHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HashingHelperService = TestBed.get(HashingHelperService);
    expect(service).toBeTruthy();
  });
});
