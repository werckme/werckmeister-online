import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedSoundcloudPlayerComponent } from './embedded-soundcloud-player.component';

describe('EmbeddedSoundcloudPlayerComponent', () => {
  let component: EmbeddedSoundcloudPlayerComponent;
  let fixture: ComponentFixture<EmbeddedSoundcloudPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedSoundcloudPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedSoundcloudPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
