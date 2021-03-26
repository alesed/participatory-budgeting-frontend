import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-size-warning',
  templateUrl: './image-size-warning.component.html',
  styleUrls: ['./image-size-warning.component.scss'],
})
export class ImageSizeWarningComponent implements OnInit {
  _fileSize: number;
  _fileMaxSize: number;

  constructor(
    public _dialogRef: MatDialogRef<ImageSizeWarningComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { size: number; allowedType: boolean; FILE_MAX_SIZE: number }
  ) {}

  ngOnInit(): void {
    this._fileSize = this.data.size / 1024 / 1024;
    this._fileMaxSize = this.data.FILE_MAX_SIZE / 1024 / 1024;
  }

  _closeDialog(): void {
    this._dialogRef.close();
  }
}
