import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDisableComponent } from './users-disable.component';

describe('UsersDisableComponent', () => {
  let component: UsersDisableComponent;
  let fixture: ComponentFixture<UsersDisableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersDisableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
