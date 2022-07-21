import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetVstComponent } from './get-vst.component';

describe('GetVstComponent', () => {
  let component: GetVstComponent;
  let fixture: ComponentFixture<GetVstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetVstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetVstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
