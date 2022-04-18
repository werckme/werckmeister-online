import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmbeddedYoutubeComponent } from './embedded-youtube.component';

describe('EmbeddedYoutubeComponent', () => {
  let component: EmbeddedYoutubeComponent;
  let fixture: ComponentFixture<EmbeddedYoutubeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
