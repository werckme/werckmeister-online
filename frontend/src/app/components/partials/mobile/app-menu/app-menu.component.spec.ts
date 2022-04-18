import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MobileAppMenuComponent } from './app-menu.component';

describe('AppMenuComponent', () => {
  let component: MobileAppMenuComponent;
  let fixture: ComponentFixture<MobileAppMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAppMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
