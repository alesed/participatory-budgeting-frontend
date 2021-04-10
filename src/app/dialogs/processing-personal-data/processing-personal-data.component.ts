import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-processing-personal-data',
  templateUrl: './processing-personal-data.component.html',
  styleUrls: ['./processing-personal-data.component.scss'],
})
export class ProcessingPersonalDataComponent implements OnInit {
  _isPhonePersonalInformations = false;

  constructor(
    private _dialogRef: MatDialogRef<ProcessingPersonalDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) {
    // empty
  }

  ngOnInit(): void {
    if (this.data) this._isPhonePersonalInformations = true;
  }

  _closeDialog(): void {
    this._dialogRef.close();
  }
}
