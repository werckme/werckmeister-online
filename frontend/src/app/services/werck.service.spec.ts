import { TestBed } from '@angular/core/testing';

import { WerckService } from './werck.service';

describe('WerckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WerckService = TestBed.get(WerckService);
    expect(service).toBeTruthy();
  });
});
