import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-landing-confirmation',
  templateUrl: './landing-confirmation.component.html',
  styleUrls: ['./landing-confirmation.component.scss'],
})
export class LandingConfirmationComponent implements OnInit {
  constructor(
    public _dialogRef: MatDialogRef<LandingConfirmationComponent>,
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
