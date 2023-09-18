import { TestBed } from '@angular/core/testing';

import { UserReportService } from './user-report.service';

describe('UserReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserReportService = TestBed.get(UserReportService);
    expect(service).toBeTruthy();
  });
});
