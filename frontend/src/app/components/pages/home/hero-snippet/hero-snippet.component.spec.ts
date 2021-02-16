import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSnippetComponent } from './hero-snippet.component';

describe('HeroSnippetComponent', () => {
  let component: HeroSnippetComponent;
  let fixture: ComponentFixture<HeroSnippetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroSnippetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroSnippetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
