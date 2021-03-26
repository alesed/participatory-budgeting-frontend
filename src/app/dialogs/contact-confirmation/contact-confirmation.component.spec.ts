import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactConfirmationComponent } from './contact-confirmation.component';

describe('ContactConfirmationComponent', () => {
  let component: ContactConfirmationComponent;
  let fixture: ComponentFixture<ContactConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
