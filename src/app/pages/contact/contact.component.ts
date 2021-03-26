import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactConfirmationComponent } from 'src/app/dialogs/contact-confirmation/contact-confirmation.component';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { ContactGateway } from './gateways/contact-gateway';
import {
  ContactFormData,
  ContactInformation,
  ContactResponse,
  ContactSocialSite,
} from './types/contact.types';

const PHONE_PATTERN = '^(?=(?:.{9}|.{13})$)\\+?[0-9]*$';
const DIALOG_WIDTH = '250px';

const EMAIL_SUCCESS = 'Email byl úspěšně odeslán, obec se Vám brzo ozve!';
const EMAIL_ERROR = 'Při odesílání emailu došlo k chybě!';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  _contactForm = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_PATTERN),
    ]),
    message: new FormControl(null, [Validators.required]),
  });

  _recaptchaResponse: string;

  _informations: ContactInformation;
  _socialSites: ContactSocialSite[] = [];

  _loading = false;

  constructor(
    private _state: AppStateService,
    private _gateway: ContactGateway,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._loadCurrentContactPage(this._state.subject.name);
  }

  /**
   * Retrieve contact data from DB. Check if subject has social sites and save them
   * @param {string} subjectName
   */
  private _loadCurrentContactPage(subjectName: string): void {
    this._gateway
      .loadContactInformationData(subjectName)
      .subscribe((data: ContactInformation) => {
        this._informations = data;
        this._setSocialSiteData();
      });
  }

  /**
   * Setting property of facebook or instagram site
   */
  private _setSocialSiteData(): void {
    if (this._informations.facebook_url) {
      this._socialSites.push(<ContactSocialSite>{
        name: 'facebook',
        url: this._informations.facebook_url,
      });
    }

    if (this._informations.instagram_url) {
      this._socialSites.push(<ContactSocialSite>{
        name: 'instagram',
        url: this._informations.instagram_url,
      });
    }
  }

  /**
   * Set captcha response if exists
   * @param {string} captchaResponse
   */
  _resolvedReCaptcha(captchaResponse: string): void {
    this._recaptchaResponse = captchaResponse;
  }

  /**
   * Open send email confirmation dialog if captcha allows
   * @param {ContactFormData} data
   */
  _sendEmail(): void {
    const dialogRef = this._dialog.open(ContactConfirmationComponent, {
      width: DIALOG_WIDTH,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((decision: boolean) => {
      if (decision === true) this._sendEmailDo();
    });
  }

  /**
   * Send data of email to server and handle response
   */
  private _sendEmailDo(): void {
    this._loading = true;

    const sendData = <ContactFormData>{
      name: this._contactForm.value.name,
      email: this._contactForm.value.email,
      phone: this._contactForm.value.phone,
      message: this._contactForm.value.message,
      subjectEmail: this._informations.email,
    };

    this._gateway.sendEmail(sendData).subscribe((response: ContactResponse) => {
      if (response.success === true) {
        this._snackBar.open(EMAIL_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      } else {
        this._snackBar.open(EMAIL_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
      this._loading = false;
    });
  }
}
