import { TestBed } from '@angular/core/testing';

import { MidiplayerService } from './midiplayer.service';

describe('MidiplayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MidiplayerService = TestBed.get(MidiplayerService);
    expect(service).toBeTruthy();
  });
});
