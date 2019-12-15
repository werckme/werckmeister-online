import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenupanelComponent } from './menupanel.component';

describe('MenupanelComponent', () => {
  let component: MenupanelComponent;
  let fixture: ComponentFixture<MenupanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenupanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenupanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
