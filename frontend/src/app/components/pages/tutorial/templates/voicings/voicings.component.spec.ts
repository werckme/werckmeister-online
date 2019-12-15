import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicingsComponent } from './voicings.component';

describe('VoicingsComponent', () => {
  let component: VoicingsComponent;
  let fixture: ComponentFixture<VoicingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
