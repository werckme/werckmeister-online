import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePreviewComponent } from './resource-preview.component';

describe('ResourcePreviewComponent', () => {
  let component: ResourcePreviewComponent;
  let fixture: ComponentFixture<ResourcePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
