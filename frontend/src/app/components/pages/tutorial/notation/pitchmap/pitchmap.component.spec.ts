import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchmapComponent } from './pitchmap.component';

describe('PitchmapComponent', () => {
  let component: PitchmapComponent;
  let fixture: ComponentFixture<PitchmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitchmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
