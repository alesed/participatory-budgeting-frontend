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
import {
  LandingContactFormData,
  LandingProposalFormData,
} from './types/landing.types';

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

  _contactForm = new FormGroup({
    author: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_PATTERN),
    ]),
    message: new FormControl(null, [Validators.required]),
  });

  _isSideMenuOpened = false;

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

    const sendProposalData = <LandingProposalFormData>{
      subjectName: this._proposalForm.value.subjectName,
      email: this._proposalForm.value.email,
      phone: this._proposalForm.value.phone,
    };

    this._gateway
      .sendProposalEmail(sendProposalData)
      .subscribe((response: ContactResponse) => {
        if (response.success === true) {
          this._snackBar.open(EMAIL_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
          this._resetProposalForm();
        } else {
          this._snackBar.open(EMAIL_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
        }
        this._loadingProposal = false;
      });
  }

  /**
   * Reset form and make it untouched
   */
  private _resetProposalForm(): void {
    this._proposalForm.setValue({
      subjectName: null,
      email: null,
      phone: null,
    });
    this._proposalForm.markAsUntouched();
    this._proposalForm.markAsPristine();
  }

  /**
   * Open send email confirmation dialog if captcha allows
   * @param {ContactFormData} data
   */
  _sendContactEmail(): void {
    const dialogRef = this._dialog.open(LandingConfirmationComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((decision: boolean) => {
      if (decision === true) this._sendContactEmailDo();
    });
  }

  /**
   * Send data of email to server and handle response
   */
  private _sendContactEmailDo(): void {
    this._loadingContact = true;

    const sendContactData = <LandingContactFormData>{
      author: this._contactForm.value.author,
      email: this._contactForm.value.email,
      phone: this._contactForm.value.phone,
      message: this._contactForm.value.message,
    };

    this._gateway
      .sendContactEmail(sendContactData)
      .subscribe((response: ContactResponse) => {
        if (response.success === true) {
          this._snackBar.open(EMAIL_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
          this._resetContactForm();
        } else {
          this._snackBar.open(EMAIL_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_LANDING_CLASS,
          });
        }
        this._loadingContact = false;
      });
  }

  /**
   * Reset form and make it untouched
   */
  private _resetContactForm(): void {
    this._contactForm.setValue({
      author: null,
      email: null,
      phone: null,
      message: null,
    });
    this._contactForm.markAsUntouched();
    this._contactForm.markAsPristine();
  }

  /**
   * Toggle side menu (open or close)
   */
  _toggleSideMenu(): void {
    this._isSideMenuOpened = !this._isSideMenuOpened;
  }
}
