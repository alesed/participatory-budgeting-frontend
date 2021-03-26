import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteProcessComponent } from './vote-process.component';

describe('VoteProcessComponent', () => {
  let component: VoteProcessComponent;
  let fixture: ComponentFixture<VoteProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoteProcessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
