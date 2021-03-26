import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-confirmation',
  templateUrl: './contact-confirmation.component.html',
  styleUrls: ['./contact-confirmation.component.scss'],
})
export class ContactConfirmationComponent implements OnInit {
  constructor(
    public _dialogRef: MatDialogRef<ContactConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: unknown
  ) {}

  ngOnInit(): void {
    // empty
  }

  /**
   * Confirmation result - user confirm or decline sending
   * @param {boolean} decision
   */
  _closeDialog(decision: boolean): void {
    this._dialogRef.close(decision);
  }
}
