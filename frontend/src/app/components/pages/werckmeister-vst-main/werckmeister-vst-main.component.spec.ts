import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WerckmeisterVstMainComponent } from './werckmeister-vst-main.component';

describe('WerckmeisterVstMainComponent', () => {
  let component: WerckmeisterVstMainComponent;
  let fixture: ComponentFixture<WerckmeisterVstMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WerckmeisterVstMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WerckmeisterVstMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
