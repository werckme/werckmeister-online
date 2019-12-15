import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialsnippetComponent } from './tutorialsnippet.component';

describe('TutorialsnippetComponent', () => {
  let component: TutorialsnippetComponent;
  let fixture: ComponentFixture<TutorialsnippetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialsnippetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialsnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
