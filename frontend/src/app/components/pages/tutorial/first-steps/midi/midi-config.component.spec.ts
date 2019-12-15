import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MidiConfigComponent } from './midi-config.component';

describe('FirstStepsComponent', () => {
  let component: MidiConfigComponent;
  let fixture: ComponentFixture<MidiConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MidiConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MidiConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
