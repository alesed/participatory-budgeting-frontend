import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-settings-photo-confirmation',
  templateUrl: './settings-photo-confirmation.component.html',
  styleUrls: ['./settings-photo-confirmation.component.scss'],
})
export class SettingsPhotoConfirmationComponent implements OnInit {
  constructor(
    public _dialogRef: MatDialogRef<SettingsPhotoConfirmationComponent>
  ) {}

  ngOnInit(): void {
    // empty
  }

  _closeDialog(decision: boolean): void {
    this._dialogRef.close(decision);
  }
}
