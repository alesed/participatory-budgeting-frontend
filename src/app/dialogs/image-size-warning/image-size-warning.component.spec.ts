import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSizeWarningComponent } from './image-size-warning.component';

describe('ImageSizeWarningComponent', () => {
  let component: ImageSizeWarningComponent;
  let fixture: ComponentFixture<ImageSizeWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageSizeWarningComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSizeWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
