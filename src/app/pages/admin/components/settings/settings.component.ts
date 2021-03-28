import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { ImageSizeWarningComponent } from 'src/app/dialogs/image-size-warning/image-size-warning.component';
import { SettingsConfirmationGateway } from 'src/app/dialogs/settings-confirmation/gateways/settings-confirmation-gateway';
import { SettingsConfirmationComponent } from 'src/app/dialogs/settings-confirmation/settings-confirmation.component';
import { SettingsConfirmationResponse } from 'src/app/dialogs/settings-confirmation/types/settings-confirmation.types';
import { SettingsPhotoConfirmationComponent } from 'src/app/dialogs/settings-photo-confirmation/settings-photo-confirmation.component';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { SettingsGateway } from './gateways/settings-gateway';
import { SettingsData, SettingsResponse } from './types/settings.types';

const PHONE_PATTERN = '^(?=(?:.{9}|.{13})$)\\+?[0-9]*$';
const FILE_MAX_SIZE = 230000;

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

const PHOTO_SUCCESS = 'Změna loga systému úspěšně dokončena!';
const PHOTO_ERROR = 'Při změně loga systému došlo k chybě!';

const CHANGE_SUCCESS = 'Změna nastavení systému úspěšně dokončena!';
const CHANGE_ERROR = 'Při změně nastavení systému došlo k chybě!';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  _loadingLogo = false;
  _loadingSettings = false;

  _uploadedFile: File;
  _uploadedFileUrl: string;

  _retrievedPhoto: string;

  _contactsGroup = new FormGroup({
    subject_id: new FormControl(null),
    author: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(PHONE_PATTERN),
    ]),
    description: new FormControl(null, [Validators.required]),
    facebook_url: new FormControl(null, []),
    instagram_url: new FormControl(null, []),
  });

  constructor(
    private _gateway: SettingsGateway,
    private _gatewayConfirmation: SettingsConfirmationGateway,
    public _dialog: MatDialog,
    private _state: AppStateService,
    private _snackBar: MatSnackBar,
    private _firestore: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this._loadProjectSettings();
  }

  /**
   * Retrieve subject informations from DB and show on page
   */
  private _loadProjectSettings(): void {
    this._gateway
      .loadSubjectSettingsData(this._state.subject.name)
      .subscribe((result: SettingsData) => {
        this._contactsGroup.setValue({
          subject_id: result.subject_id,
          author: result.author,
          address: result.address,
          email: result.email,
          phone: result.phone,
          description: result.description,
          facebook_url: result.facebook_url,
          instagram_url: result.instagram_url,
        });

        this._retrievedPhoto = result.photo;
      });
  }

  /**
   * Check file size, allowed type and prepare for save to DB
   * @param {EventTarget} inputFiles
   */
  _uploadFile(inputFiles: EventTarget): void {
    const uploadedImg = (inputFiles as HTMLInputElement).files[0];

    const isAllowedType = ALLOWED_FILE_TYPES.includes(uploadedImg?.type);

    if (uploadedImg.size > FILE_MAX_SIZE || !isAllowedType) {
      this._openImgWarningDialog(uploadedImg.size, isAllowedType);
      return;
    }

    this._uploadedFile = uploadedImg;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this._uploadedFileUrl = event.target.result as string;
    };
    reader.readAsDataURL(this._uploadedFile);
  }

  _saveFile(): void {
    const dialogRef = this._dialog.open(SettingsPhotoConfirmationComponent, {
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((decision: boolean) => {
      if (decision) this._saveLogoToFirebaseStorage();
    });
  }

  /**
   * Save logo to firebase storage
   */
  private _saveLogoToFirebaseStorage(): void {
    this._loadingLogo = true;

    const filePath = `/logo/${this._state.subject.name}`;
    const file = this._uploadedFile;

    const fileRef = this._firestore.ref(filePath);
    const task = this._firestore.upload(filePath, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            if (url) {
              this._saveFileDo(url);
            }
          });
        })
      )
      .subscribe();
  }

  /**
   * Save new photo url to DB and notify user
   * @param {string} photoPath
   */
  private _saveFileDo(photoPath: string): void {
    this._gateway
      .updateSubjectLogo(this._state.subject.name, photoPath)
      .subscribe((result: SettingsResponse) => {
        if (result.success) {
          this._snackBar.open(PHOTO_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        } else {
          this._snackBar.open(PHOTO_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        }

        this._loadingLogo = false;
      });
  }

  /**
   * Open warning dialog if type or size is incorrect
   * @param {number} size
   * @param {boolean} allowedType
   */
  private _openImgWarningDialog(size: number, allowedType: boolean): void {
    this._dialog.open(ImageSizeWarningComponent, {
      disableClose: true,
      data: { size, allowedType, FILE_MAX_SIZE },
    });
  }

  _updateData(): void {
    const dialogRef = this._dialog.open(SettingsConfirmationComponent, {
      disableClose: true,
      data: this._getUpdateData(),
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this._loadingSettings = true;

        this._updateSettings();
      }
    });
  }

  private _updateSettings(): void {
    this._gatewayConfirmation
      .updateSettings(this._getUpdateData())
      .subscribe((result: SettingsConfirmationResponse) => {
        if (result.success) {
          this._loadProjectSettings();
          this._snackBar.open(CHANGE_SUCCESS, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        } else {
          this._snackBar.open(CHANGE_ERROR, SNACKBAR_CLOSE, {
            duration: SNACKBAR_DURATION,
            panelClass: SNACKBAR_CLASS,
          });
        }

        this._loadingSettings = false;
      });
  }

  private _getUpdateData(): SettingsData {
    return <SettingsData>{
      subject_id: this._contactsGroup.controls.subject_id.value,
      author: this._contactsGroup.controls.author.value,
      address: this._contactsGroup.controls.address.value,
      email: this._contactsGroup.controls.email.value,
      phone: this._contactsGroup.controls.phone.value,
      description: this._contactsGroup.controls.description.value,
      facebook_url: this._contactsGroup.controls.facebook_url.value,
      instagram_url: this._contactsGroup.controls.instagram_url.value,
    };
  }
}
