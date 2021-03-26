import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';

const HISTORY_PAGE = 'history';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss'],
})
export class SideNavigationComponent implements OnInit {
  @Output() toggleHamburger = new EventEmitter<void>();

  _isHistoryPageActive = false;

  _historicalYears = [2018, 2019];

  constructor(public _state: AppStateService, router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        event.urlAfterRedirects.split('/').includes(HISTORY_PAGE)
          ? (this._isHistoryPageActive = true)
          : (this._isHistoryPageActive = false);
      }
    });
  }

  ngOnInit(): void {
    // empty
  }

  /**
   * Open side menu if page layout has menu visible
   */
  public _emitToggleHamburger(): void {
    this.toggleHamburger.emit();
  }
}
