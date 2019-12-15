import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MmenuitemComponent } from './mmenuitem.component';

describe('MmenuitemComponent', () => {
  let component: MmenuitemComponent;
  let fixture: ComponentFixture<MmenuitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MmenuitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MmenuitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
