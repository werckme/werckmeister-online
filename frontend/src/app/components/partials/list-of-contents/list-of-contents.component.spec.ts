import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfContentsComponent } from './list-of-contents.component';

describe('ListOfContentsComponent', () => {
  let component: ListOfContentsComponent;
  let fixture: ComponentFixture<ListOfContentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfContentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
