import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';
import firebase from 'firebase/app';
import { AuthService } from 'src/app/helpers/auth/auth.service';
import { SharedGateway } from 'src/app/shared/gateways/shared-gateway';

const HISTORY_PAGE = 'history';
const ADMIN_PAGE = 'admin';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  @Output() toggleHamburger = new EventEmitter<void>();

  user: firebase.User;

  _isHistoryPageActive = false;
  _isAdminPageActive = false;

  _historicalYears = [2018, 2019];

  constructor(
    public _state: AppStateService,
    router: Router,
    private _authService: AuthService,
    private _gateway: SharedGateway
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._includesHistoryPage(event);
        this._includesAdminPage(event);
      }
    });
  }

  private _includesHistoryPage(event: NavigationEnd): void {
    event.urlAfterRedirects.split('/').includes(HISTORY_PAGE)
      ? (this._isHistoryPageActive = true)
      : (this._isHistoryPageActive = false);
  }

  private _includesAdminPage(event: NavigationEnd): void {
    event.urlAfterRedirects.split('/').includes(ADMIN_PAGE)
      ? (this._isAdminPageActive = true)
      : (this._isAdminPageActive = false);
  }

  ngOnInit(): void {
    this._authService.getUserState().subscribe((user) => {
      this.user = user;
    });

    setTimeout(() => {
      this._loadHistoricYears(this._state.subject?.name);
    }, 1000);
  }

  /**
   * Retrieve distinct years of projects from DB
   * @param {string} subjectName
   */
  private _loadHistoricYears(subjectName: string): void {
    this._gateway
      .loadNavigationHistoryYears(subjectName)
      .subscribe((data: number[]) => {
        this._historicalYears = data;
      });
  }

  /**
   * Logout user from current session
   */
  _logout(): void {
    this._authService.logout();
    this.toggleHamburger.emit();
  }

  /**
   * Open side menu if page layout has menu visible
   */
  public _emitToggleHamburger(): void {
    this.toggleHamburger.emit();
  }
}
