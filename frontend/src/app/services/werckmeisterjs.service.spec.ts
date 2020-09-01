import { TestBed } from '@angular/core/testing';

import { WerckmeisterjsService } from './werckmeisterjs.service';

describe('WerckmeisterjsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WerckmeisterjsService = TestBed.get(WerckmeisterjsService);
    expect(service).toBeTruthy();
  });
});
