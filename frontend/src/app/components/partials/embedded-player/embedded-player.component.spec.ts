import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbeddedPlayerComponent } from './embedded-player.component';

describe('EmbeddedPlayerComponent', () => {
  let component: EmbeddedPlayerComponent;
  let fixture: ComponentFixture<EmbeddedPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbeddedPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbeddedPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
