import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { ProposalGateway } from 'src/app/pages/proposal/gateways/proposal-gateway';
import {
  ProposalConfirmation,
  ProposalFormColumns,
  ProposalResponse,
  ProposalSendData,
} from 'src/app/pages/proposal/types/proposal.types';
import { AppStateService } from 'src/app/services/app-state.service';
import { ProposalConfirmationDialogData } from './types/proposal-confirmation.types';

const TITLE_SEND = 'Odevzdat';
const TITLE_SEND_NOT_POSSIBLE = 'Nelze odevzdat';
const DESCRIPTION_NEEDED = '<strong>Je potřeba doplnit:</strong><br>';
const DESCRIPTION_SEND =
  'Opravdu chcete odevzdat návrh?<br>(Po odeslání je třeba vyčkat na vyjádření zastupitelstva, jinak nelze hlasovat.)<br/>';
const DESCRIPTION_PHOTO_NEEDED =
  '- nahrát <strong>fotku</strong> ve formuláři<br>';
const DESCRIPTION_MARKER_NEEDED = '- vybrat místo na <strong>mapě</strong><br>';
const DESCRIPTION_EXPENSES =
  '<br><strong>Volitelné</strong> - nezadali jste žádné náklady';

const TITLE_DISCARD = 'Zahodit';
const DESCRIPTION_DISCARD = 'Opravdu chcete zahodit návrh?';

@Component({
  selector: 'app-proposal-confirmation',
  templateUrl: './proposal-confirmation.component.html',
  styleUrls: ['./proposal-confirmation.component.scss'],
})
export class ProposalConfirmationComponent implements OnInit {
  _loading = false;

  _title: string;
  _description: string;

  _allowYesButton = false;

  constructor(
    public _dialogRef: MatDialogRef<ProposalConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProposalConfirmationDialogData,
    private _state: AppStateService,
    private _firestore: AngularFireStorage,
    private _gateway: ProposalGateway
  ) {}

  ngOnInit(): void {
    if (this.data.dialogType === ProposalConfirmation.Send) {
      this._checkSendDialogStatus();
    } else {
      this._allowYesButton = true;
      this._title = TITLE_DISCARD;
      this._description = DESCRIPTION_DISCARD;
    }
  }

  private _checkSendDialogStatus(): void {
    if (!this.data.photoExists || !this.data.markerExists) {
      this._description = DESCRIPTION_NEEDED;

      if (!this.data.photoExists) this._description += DESCRIPTION_PHOTO_NEEDED;
      if (!this.data.markerExists)
        this._description += DESCRIPTION_MARKER_NEEDED;

      if (!this.data.expensesExist) this._description += DESCRIPTION_EXPENSES;

      this._title = TITLE_SEND_NOT_POSSIBLE;
    } else {
      this._description = DESCRIPTION_SEND;

      if (!this.data.expensesExist) this._description += DESCRIPTION_EXPENSES;

      this._allowYesButton = true;
      this._title = TITLE_SEND;
    }
  }

  _closeDialog(decision: boolean): void {
    if (decision === true) {
      this.data.dialogType === ProposalConfirmation.Send
        ? this._savePhotoToFirebaseStorage()
        : this._dialogRef.close(ProposalConfirmation.Discard);
    } else {
      this._dialogRef.close(ProposalConfirmation.Nothing);
    }
  }

  /**
   * After dialog confirmation actually save the proposal
   */
  private _sendProposalDo(firebasePhotoPathUrl: string): void {
    const preparedData = this._prepareSendData(firebasePhotoPathUrl);

    this._gateway
      .uploadProject(preparedData)
      .subscribe((result: ProposalResponse) => {
        if (result.success) {
          this._dialogRef.close(true);
        } else {
          this._dialogRef.close(false);
        }
      });
    () => {
      this._dialogRef.close(false);
    };
  }

  /**
   * Get the uploaded file and save it to firebase storage
   * @returns {AngularFireUploadTask}
   */
  private _savePhotoToFirebaseStorage(): void {
    this._loading = true;

    const filePath = `/images/${this._state.subject.name}/${this.data.uploadedFile.name}`;
    const file = this.data.uploadedFile;

    const fileRef = this._firestore.ref(filePath);
    const task = this._firestore.upload(filePath, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            if (url) {
              this._sendProposalDo(url);
            }
          });
        })
      )
      .subscribe();
  }

  /**
   * Prepare data to be send to DB including saved picture path in firebase storage
   * @param {string} photoPath
   * @returns {ProposalSendData}
   */
  private _prepareSendData(photoPath: string): ProposalSendData {
    return <ProposalSendData>{
      subjectName: this._state.subject.name,
      projectName: this.data.proposalForm.get(ProposalFormColumns.PROJECT_NAME)
        .value,
      author: this.data.proposalForm.get(ProposalFormColumns.AUTHOR).value,
      authorEmail: this.data.proposalForm.get(ProposalFormColumns.AUTHOR_EMAIL)
        .value,
      category: this.data.proposalForm.get(ProposalFormColumns.CATEGORY).value,
      description: this.data.proposalForm.get(ProposalFormColumns.DESCRIPTION)
        .value,
      expenses: this.data.expenses,
      mapMarker: this.data.mapMarker,
      photo: {
        photoName: this.data.uploadedFile.name,
        photoFirebasePath: photoPath,
      },
    };
  }
}
