import { TestBed } from '@angular/core/testing';

import { BookModuleService } from './book-module.service';

describe('BookModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookModuleService = TestBed.get(BookModuleService);
    expect(service).toBeTruthy();
  });
});
