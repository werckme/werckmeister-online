import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMidiComponent } from './selectmidi.component';

describe('SelectmidiComponent', () => {
  let component: SelectMidiComponent;
  let fixture: ComponentFixture<SelectMidiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMidiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
