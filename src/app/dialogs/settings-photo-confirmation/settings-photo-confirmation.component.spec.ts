import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPhotoConfirmationComponent } from './settings-photo-confirmation.component';

describe('SettingsPhotoConfirmationComponent', () => {
  let component: SettingsPhotoConfirmationComponent;
  let fixture: ComponentFixture<SettingsPhotoConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPhotoConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPhotoConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
