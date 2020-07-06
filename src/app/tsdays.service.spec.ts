import { TestBed } from '@angular/core/testing';

import { TsdaysService } from './days.service';

describe('DaysService', () => {
  let service: TsdaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TsdaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
