/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoordinateServiceService } from './coordinate-service.service';

describe('Service: CoordinateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoordinateServiceService]
    });
  });

  it('should ...', inject([CoordinateServiceService], (service: CoordinateServiceService) => {
    expect(service).toBeTruthy();
  }));
});
