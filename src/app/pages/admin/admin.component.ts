import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/helpers/auth/auth.service';
import firebase from 'firebase/app';
import { UserDetails } from 'src/app/helpers/auth/types/auth.types';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  _isOwner = false;
  user: firebase.User;

  constructor(
    private _authService: AuthService,
    public _state: AppStateService
  ) {}

  ngOnInit(): void {
    this._authService.getUserState().subscribe((user) => {
      if (!user) return;

      user.getIdToken().then((token) => {
        this._state.userToken = token;

        this.user = user;
        this._getUserOwnershipStatus(this.user.uid);
      });
    });
  }

  /**
   * Check user permission - IsOwner flag is able to control user tab
   * @param {string} uid
   */
  private _getUserOwnershipStatus(uid: string): void {
    this._authService.getUserMetadata(uid).subscribe((document) => {
      const userData = document.data() as UserDetails;
      this._isOwner = userData.isOwner;
    });
  }
}
