import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippedComponent } from './snipped.component';

describe('SnippedComponent', () => {
  let component: SnippedComponent;
  let fixture: ComponentFixture<SnippedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnippedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
