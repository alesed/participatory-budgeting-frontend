import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-polygon-confirmation',
  templateUrl: './polygon-confirmation.component.html',
  styleUrls: ['./polygon-confirmation.component.scss'],
})
export class PolygonConfirmationComponent implements OnInit {
  _selectedArea: string;

  constructor(
    public _dialogRef: MatDialogRef<PolygonConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit(): void {
    this._selectedArea = (this.data / 1000000).toFixed(3); // from m2 to km2
  }

  _closeDialog(decision: boolean): void {
    this._dialogRef.close(decision);
  }
}
