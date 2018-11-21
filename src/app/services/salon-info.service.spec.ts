import { TestBed } from '@angular/core/testing';

import { SalonInfoService } from './salon-info.service';

describe('SalonInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalonInfoService = TestBed.get(SalonInfoService);
    expect(service).toBeTruthy();
  });
});
