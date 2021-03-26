import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonConfirmationComponent } from './polygon-confirmation.component';

describe('PolygonConfirmationComponent', () => {
  let component: PolygonConfirmationComponent;
  let fixture: ComponentFixture<PolygonConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolygonConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
