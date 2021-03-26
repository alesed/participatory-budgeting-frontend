import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsConfirmationGateway } from './gateways/settings-confirmation-gateway';
import {
  SettingsConfirmationData,
  SettingsConfirmationResponse,
} from './types/settings-confirmation.types';

@Component({
  selector: 'app-settings-confirmation',
  templateUrl: './settings-confirmation.component.html',
  styleUrls: ['./settings-confirmation.component.scss'],
})
export class SettingsConfirmationComponent implements OnInit {
  constructor(
    public _dialogRef: MatDialogRef<SettingsConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SettingsConfirmationData,
    private _gateway: SettingsConfirmationGateway
  ) {}

  ngOnInit(): void {
    // empty
  }

  _closeDialog(): void {
    this._dialogRef.close();
  }

  _updateSettings(): void {
    this._gateway
      .updateSettings(this.data)
      .subscribe((result: SettingsConfirmationResponse) => {
        if (result.success) this._dialogRef.close(true);
        else this._dialogRef.close(false);
      });
  }
}
