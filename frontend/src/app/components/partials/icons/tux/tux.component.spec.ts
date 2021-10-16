import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TuxComponent } from './tux.component';

describe('TuxComponent', () => {
  let component: TuxComponent;
  let fixture: ComponentFixture<TuxComponent>;

  beforeEach(waitForAsync(() => {
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
