import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuxComponent } from './tux.component';

describe('TuxComponent', () => {
  let component: TuxComponent;
  let fixture: ComponentFixture<TuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
