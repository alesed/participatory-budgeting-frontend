import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConfirmationComponent } from './settings-confirmation.component';

describe('SettingsConfirmationComponent', () => {
  let component: SettingsConfirmationComponent;
  let fixture: ComponentFixture<SettingsConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
