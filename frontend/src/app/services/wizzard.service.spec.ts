import { TestBed } from '@angular/core/testing';

import { WizzardService } from './wizzard.service';

describe('WizzardService', () => {
  let service: WizzardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WizzardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
