import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmbeddedSoundcloudLinkComponent } from './embedded-soundcloud-link.component';

describe('EmbeddedSoundcloudLinkComponent', () => {
  let component: EmbeddedSoundcloudLinkComponent;
  let fixture: ComponentFixture<EmbeddedSoundcloudLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedSoundcloudLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedSoundcloudLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
