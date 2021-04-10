import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-processing-personal-data',
  templateUrl: './processing-personal-data.component.html',
  styleUrls: ['./processing-personal-data.component.scss'],
})
export class ProcessingPersonalDataComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<ProcessingPersonalDataComponent>
  ) {
    // empty
  }

  ngOnInit(): void {
    // empty
  }

  _closeDialog(): void {
    this._dialogRef.close();
  }
}
