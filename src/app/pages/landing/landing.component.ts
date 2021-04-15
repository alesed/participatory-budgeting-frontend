import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LandingConfirmationComponent } from 'src/app/dialogs/landing-confirmation/landing-confirmation.component';
import {
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
  SNACKBAR_LANDING_CLASS,
} from 'src/app/shared/types/shared.types';
import { ContactResponse } from '../contact/types/contact.types';
import { LandingGateway } from './gateways/landing-gateway';
import { LandingProposalFormData } from './types/landing.types';

const EMAIL_SUCCESS = 'Email byl úspěšně odeslán, obec se Vám brzo ozve!';
const EMAIL_ERROR = 'Při odesílání emailu došlo k chybě!';

const PHONE_PATTERN = '^(\\+\\d{12}|\\d{9})$';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  _loadingProposal = false;
  _loadingContact = false;

  _proposalForm = new FormGroup({
    subjectName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_PATTERN),
    ]),
  });

  constructor(
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _gateway: LandingGateway
  ) {
    // empty
  }

  ngOnInit(): void {
    // empty
  }

  /**
   * Open send email confirmation dialog if captcha allows
   * @param {ContactFormData} data
   */
  _sendProposalEmail(): void {
    const dialogRef = this._dialog.open(LandingConfirmationComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((decision: boolean) => {
      if (decision === true) this._sendProposalEmailDo();
    });
  }

  /**
   * Send data of email to server and handle response
   */
  private _sendProposalEmailDo(): void {
    this._loadingProposal = true;

    const sendData = <LandingProposalFormData>{
      name: this._proposalForm.value.name,
      email: this._proposalForm.value.email,
      phone: this._proposalForm.value.phone,
    };

    this._gateway
      .sendProposalEmail(sendData)
      .subscribe((response: ContactResponse) => {
        if (response.success === true) {
          this._snackBar.open(EMAIL_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
        } else {
          this._snackBar.open(EMAIL_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
        }
        this._loadingProposal = false;
      });
  }

  _sendContactEmail(): void {
    // TODO:
    console.log('testContact');
    this._loadingContact = true;
  }
}
