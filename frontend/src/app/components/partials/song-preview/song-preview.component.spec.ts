import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SongPreviewComponent } from './song-preview.component';

describe('SongPreviewComponent', () => {
  let component: SongPreviewComponent;
  let fixture: ComponentFixture<SongPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SongPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
