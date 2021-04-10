import { AfterViewInit, Component, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WindowService } from 'src/app/services/window.service';
import firebase from 'firebase/app';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { VoteProcessGateway } from './gateways/vote-process-gateway';
import { VoteProcessResponse } from './types/vote-process.types';
import { AppStateService } from 'src/app/services/app-state.service';
import { ProcessingPersonalDataComponent } from '../processing-personal-data/processing-personal-data.component';

const PHONE_PATTERN = '^(\\+\\d{12}|\\d{9})$';

@Component({
  selector: 'app-vote-process',
  templateUrl: './vote-process.component.html',
  styleUrls: ['./vote-process.component.scss'],
})
export class VoteProcessComponent implements AfterViewInit {
  _windowRef: Window;

  _loading = false;
  _insertCodePart = false;

  _phoneForm = new FormGroup({
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_PATTERN),
    ]),
  });

  _codeForm = new FormGroup({
    code: new FormControl(null, [Validators.required]),
  });

  constructor(
    public _dialogRef: MatDialogRef<VoteProcessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private _window: WindowService,
    private _fireAuth: AngularFireAuth,
    private _gateway: VoteProcessGateway,
    private _state: AppStateService,
    public _dialog: MatDialog
  ) {
    //
  }

  ngAfterViewInit(): void {
    this._windowRef = this._window.windowRef;
    this._windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'vote-button',
      {
        size: 'invisible',
      }
    );
  }

  _sendCodeToPhone(form: FormGroup): void {
    this._loading = true;
    let phoneNumber = form.value.phone;
    if (phoneNumber.split('').length === 9) phoneNumber = '+420' + phoneNumber;

    this._gateway
      .checkVotes(phoneNumber)
      .subscribe((result: VoteProcessResponse) => {
        if (result.success) {
          const appVerifier = this._windowRef.recaptchaVerifier;

          this._fireAuth
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((result: firebase.auth.ConfirmationResult) => {
              this._windowRef.confirmationResult = result;

              this._insertCodePart = true;
              this._loading = false;
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          this._dialogRef.close(result);
        }
      });
  }

  _verifyCode(form: FormGroup): void {
    this._loading = true;

    const code = form.value.code;
    this._windowRef.confirmationResult
      .confirm(code)
      .then(() => {
        this._fireAuth.signOut();
        this._voteForProject(this._phoneForm, this.data);
      })
      .catch(() => {
        this._loading = false;
      });
  }

  private _voteForProject(form: FormGroup, projectId: number): void {
    let phoneNumber = form.value.phone;
    if (phoneNumber.length === 9) phoneNumber = '+420' + phoneNumber;

    this._gateway
      .voteForProject(this._state.subject.name, phoneNumber, projectId)
      .subscribe((result: VoteProcessResponse) => {
        this._dialogRef.close(result);
      });

    this._loading = false;
  }

  _openPersonalDataDialog(): void {
    this._dialog.open(ProcessingPersonalDataComponent, {
      disableClose: false,
      data: true,
    });
  }
}
