import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProposalConfirmation } from 'src/app/pages/proposal/types/proposal.types';
import { ProposalConfirmationDialogData } from './types/proposal-confirmation.types';

const TITLE_SEND = 'Odevzdat';
const TITLE_SEND_NOT_POSSIBLE = 'Nelze odevzdat';
const DESCRIPTION_NEEDED = '<strong>Je potřeba doplnit:</strong><br>';
const DESCRIPTION_SEND = 'Opravdu chcete odevzdat návrh?<br>';
const DESCRIPTION_PHOTO_NEEDED =
  '- nahrát <strong>fotku</strong> ve formuláři<br>';
const DESCRIPTION_MARKER_NEEDED = '- vybrat místo na <strong>mapě</strong><br>';
const DESCRIPTION_EXPENSES =
  '<br><strong>(Nezadali jste žádné náklady.)</strong>';

const TITLE_DISCARD = 'Zahodit';
const DESCRIPTION_DISCARD = 'Opravdu chcete zahodit návrh?';

@Component({
  selector: 'app-proposal-confirmation',
  templateUrl: './proposal-confirmation.component.html',
  styleUrls: ['./proposal-confirmation.component.scss'],
})
export class ProposalConfirmationComponent implements OnInit {
  _title: string;
  _description: string;

  _allowYesButton = false;

  constructor(
    public _dialogRef: MatDialogRef<ProposalConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProposalConfirmationDialogData
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
        ? this._dialogRef.close(ProposalConfirmation.Send)
        : this._dialogRef.close(ProposalConfirmation.Discard);
    } else {
      this._dialogRef.close(ProposalConfirmation.Nothing);
    }
  }
}
