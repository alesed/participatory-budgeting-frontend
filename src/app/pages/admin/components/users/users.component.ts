import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersCreateComponent } from 'src/app/dialogs/users-create/users-create.component';
import { UsersDisableComponent } from 'src/app/dialogs/users-disable/users-disable.component';
import { AuthService } from 'src/app/helpers/auth/auth.service';
import { UserDetails } from 'src/app/helpers/auth/types/auth.types';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { UserCreateData } from './types/users.types';

const DISABLE_SUCCESS = 'Změna blokace uživatele úspěšně dokončena!';
const DISABLE_ERROR = 'Při změně blokace uživatele došlo k chybě!';

const CREATE_SUCCESS = 'Vytvoření uživatele úspěšně dokončeno!';
const CREATE_ERROR = 'Při vytváření uživatele došlo k chybě!';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  _users: UserDetails[] = [];

  _isFirstUserLoad = true;

  constructor(
    private _authService: AuthService,
    private _state: AppStateService,
    public _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._getAllSubjectUsers();

    this._authService.eventAuthError$.subscribe((error) => {
      if (!error || this._isFirstUserLoad) return;
      this._snackBar.open(CREATE_ERROR, SNACKBAR_CLOSE, {
        duration: SNACKBAR_DURATION,
        panelClass: SNACKBAR_CLASS,
      });
    });
  }

  private _getAllSubjectUsers(disableUpdate?: boolean): void {
    this._users = [];
    this._authService
      .getAllUsersExcludingOwner(this._state.subject.name)
      .subscribe((users) => {
        if (!this._isFirstUserLoad && !disableUpdate) {
          this._showCreateUserSnackbar();
        }

        this._isFirstUserLoad = false;
        users.forEach((user) => {
          const userData = user.data() as UserDetails;
          this._users.push({
            ...userData,
            uid: user.id,
          });
        });
      });
  }

  private _showCreateUserSnackbar(): void {
    this._snackBar.open(CREATE_SUCCESS, SNACKBAR_CLOSE, {
      duration: SNACKBAR_DURATION,
      panelClass: SNACKBAR_CLASS,
    });
  }

  _openCreateUserDialog(): void {
    const createDialog = this._dialog.open(UsersCreateComponent, {
      disableClose: true,
    });

    createDialog.afterClosed().subscribe((newUser: UserCreateData) => {
      if (newUser) this._authService.createUser(newUser);
      // TODO: after creating user data is not updated and snackbar neither
    });
  }

  _disableUserDialog(user: UserDetails): void {
    const disableDialog = this._dialog.open(UsersDisableComponent, {
      disableClose: true,
      data: user,
    });

    disableDialog.afterClosed().subscribe((decision: boolean) => {
      if (decision) this._updateDisabledStatus(user);
    });
  }

  private _updateDisabledStatus(user: UserDetails): void {
    this._authService
      .changeDisabledStatus(user)
      .then(() => {
        this._snackBar.open(DISABLE_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
        this._getAllSubjectUsers(true);
      })
      .catch(() => {
        this._snackBar.open(DISABLE_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      });
  }
}
