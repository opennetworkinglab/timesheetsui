import { TestBed } from '@angular/core/testing';

import { TsweeklyService } from './tsweekly.service';

describe('TsweeklyService', () => {
  let service: TsweeklyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TsweeklyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
