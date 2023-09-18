import { TestBed } from '@angular/core/testing';

import { TasinmazReportService } from './tasinmaz-report.service';

describe('TasinmazReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TasinmazReportService = TestBed.get(TasinmazReportService);
    expect(service).toBeTruthy();
  });
});
