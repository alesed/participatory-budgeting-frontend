import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/helpers/auth/auth.service';
import { AppStateService } from 'src/app/services/app-state.service';
import firebase from 'firebase/app';
import { SharedGateway } from 'src/app/shared/gateways/shared-gateway';
import { NavigationEnd, Router } from '@angular/router';

const HISTORY_PAGE = 'history';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @Output() toggleHamburger = new EventEmitter<void>();

  user: firebase.User;

  _isHistoryPageActive = false;

  _historicalYears: number[] = [];

  constructor(
    public _state: AppStateService,
    private _authService: AuthService,
    private _gateway: SharedGateway,
    router: Router
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.urlAfterRedirects.split('/').includes(HISTORY_PAGE)
          ? (this._isHistoryPageActive = true)
          : (this._isHistoryPageActive = false);
      }
    });
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
   * Open side menu if page layout has menu visible
   */
  public _emitToggleHamburger(): void {
    this.toggleHamburger.emit();
  }

  /**
   * Logout user from current session
   */
  _logout(): void {
    this._authService.logout();
  }

  _getLogoContent(): Record<string, unknown> {
    return {
      'background-image': `url(${this._state.logoUrl})`,
      'background-size': 'cover',
      'background-position': 'center',
    };
  }
}
