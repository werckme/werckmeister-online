import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VstComponent } from './vst.component';

describe('VstComponent', () => {
  let component: VstComponent;
  let fixture: ComponentFixture<VstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
