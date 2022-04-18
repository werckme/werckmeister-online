import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmbeddedSoundcloudPlayerComponent } from './embedded-soundcloud-player.component';

describe('EmbeddedSoundcloudPlayerComponent', () => {
  let component: EmbeddedSoundcloudPlayerComponent;
  let fixture: ComponentFixture<EmbeddedSoundcloudPlayerComponent>;

  beforeEach(waitForAsync(() => {
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
