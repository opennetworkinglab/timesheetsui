import { TestBed } from '@angular/core/testing';

import { TsweeksService } from './tsweeks.service';

describe('TsweeksService', () => {
  let service: TsweeksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TsweeksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
