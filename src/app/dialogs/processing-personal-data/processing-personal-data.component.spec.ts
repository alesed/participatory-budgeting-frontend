import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingPersonalDataComponent } from './processing-personal-data.component';

describe('ProcessingPersonalDataComponent', () => {
  let component: ProcessingPersonalDataComponent;
  let fixture: ComponentFixture<ProcessingPersonalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessingPersonalDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingPersonalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
