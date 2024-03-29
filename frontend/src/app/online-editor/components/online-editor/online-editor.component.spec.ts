import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlineEditorComponent } from './online-editor.component';

describe('OnlineEditorComponent', () => {
  let component: OnlineEditorComponent;
  let fixture: ComponentFixture<OnlineEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
