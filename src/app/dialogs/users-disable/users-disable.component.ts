import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetails } from 'src/app/helpers/auth/types/auth.types';

const DISABLE = 'ZABLOKOVAT';
const ENABLE = 'ODBLOKOVAT';

@Component({
  selector: 'app-users-disable',
  templateUrl: './users-disable.component.html',
  styleUrls: ['./users-disable.component.scss'],
})
export class UsersDisableComponent implements OnInit {
  _selectedUser: UserDetails;

  _title: string;

  constructor(
    public _dialogRef: MatDialogRef<UsersDisableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDetails
  ) {}

  ngOnInit(): void {
    this._selectedUser = this.data;

    if (this._selectedUser.isDisabled) this._title = ENABLE;
    else this._title = DISABLE;
  }

  _closeDialog(decision: boolean): void {
    this._dialogRef.close(decision);
  }
}
