import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadDetailsComponent } from './download-details.component';

describe('DownloadDetailsComponent', () => {
  let component: DownloadDetailsComponent;
  let fixture: ComponentFixture<DownloadDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
