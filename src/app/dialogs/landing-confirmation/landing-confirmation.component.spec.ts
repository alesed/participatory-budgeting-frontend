import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingConfirmationComponent } from './landing-confirmation.component';

describe('LandingConfirmationComponent', () => {
  let component: LandingConfirmationComponent;
  let fixture: ComponentFixture<LandingConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
