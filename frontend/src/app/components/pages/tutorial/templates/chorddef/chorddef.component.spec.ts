import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChorddefComponent } from './chorddef.component';

describe('ChorddefComponent', () => {
  let component: ChorddefComponent;
  let fixture: ComponentFixture<ChorddefComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChorddefComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChorddefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
