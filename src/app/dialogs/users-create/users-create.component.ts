import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.scss'],
})
export class UsersCreateComponent implements OnInit {
  _userForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    surname: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  _hidePassword = false;

  constructor(
    public _dialogRef: MatDialogRef<UsersCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown
  ) {}

  ngOnInit(): void {
    this._getRandomlyGeneratedPassword();
  }

  /**
   * Close dialog
   */
  _closeDialog(): void {
    this._dialogRef.close(null);
  }

  /**
   * Close dialog with entered form
   */
  _createUser(): void {
    this._dialogRef.close(this._userForm.value);
  }

  /**
   * Create randomly generated initial password
   */
  private _getRandomlyGeneratedPassword(): void {
    const generatedPassword = Math.random().toString(36).slice(2);
    this._userForm.setValue({
      name: null,
      surname: null,
      email: null,
      password: generatedPassword,
    });
  }
}
