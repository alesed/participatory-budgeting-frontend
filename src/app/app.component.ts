import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';

const LAYOUT_REGEX_CONDITION = '\\/#.+';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'participatory-budgeting';
  _regex = RegExp(LAYOUT_REGEX_CONDITION);
  _showNavigationBar = true;

  constructor(router: Router) {
    router.events.subscribe((result) => {
      if (result instanceof NavigationEnd) {
        if (
          result.urlAfterRedirects.length === 1 ||
          this._regex.test(result.urlAfterRedirects)
        ) {
          this._showNavigationBar = false;
        } else {
          this._showNavigationBar = true;
        }
      }
    });
  }

  @ViewChild('drawer') drawer: MatDrawer;

  _toggleHamburger(): void {
    this.drawer.toggle();
  }
}
