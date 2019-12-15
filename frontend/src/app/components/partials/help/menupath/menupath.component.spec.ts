import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenupathComponent } from './menupath.component';

describe('MenupathComponent', () => {
  let component: MenupathComponent;
  let fixture: ComponentFixture<MenupathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenupathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenupathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
