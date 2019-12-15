import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialTocComponent } from './toc.component';

describe('TocComponent', () => {
  let component: TutorialTocComponent;
  let fixture: ComponentFixture<TutorialTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
