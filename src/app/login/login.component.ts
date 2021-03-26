import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../helpers/auth/auth.service';
import firebase from 'firebase/app';
import { LoginError } from './types/login.types';

const FORGOTTEN_EMAIL_SERVER_ERROR = 'Email nelze obnovit!';
const FORGOTTEN_EMAIL_ERROR =
  'Email byl špatně zadán, neexistuje nebo nelze momentálně obnovit!';
const FORGOTTEN_EMAIL_SUCCESS =
  'Na zadaný email jsme poslali odkaz na změnu hesla!';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authError: LoginError;
  _forgottenPasswordStatus: string;
  user: firebase.User;

  _loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private _authService: AuthService) {}

  ngOnInit(): void {
    this._authService.eventAuthError$.subscribe((data: LoginError) => {
      this.authError = data;
    });

    this._authService.getUserState().subscribe((user) => {
      this.user = user;
    });
  }

  /**
   * Firebase login - basic email/password method
   */
  _loginWithEmailAndPassword(): void {
    this._authService.login(
      this._loginForm.value.email,
      this._loginForm.value.password
    );
  }

  /**
   * Logout user from current session
   */
  _logout(): void {
    this._authService.logout();
  }

  /**
   * Send email with password reset
   */
  _forgottenPassword(): void {
    this._authService
      .forgottenPassword(this._loginForm.value.email)
      .then(
        () => (this._forgottenPasswordStatus = FORGOTTEN_EMAIL_SUCCESS),
        () => (this.authError = { message: FORGOTTEN_EMAIL_ERROR })
      )
      .catch(
        () => (this.authError = { message: FORGOTTEN_EMAIL_SERVER_ERROR })
      );
  }
}
