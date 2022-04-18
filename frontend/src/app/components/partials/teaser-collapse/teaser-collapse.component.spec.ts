import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaserCollapseComponent } from './teaser-collapse.component';

describe('TeaserCollapseComponent', () => {
  let component: TeaserCollapseComponent;
  let fixture: ComponentFixture<TeaserCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeaserCollapseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeaserCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
