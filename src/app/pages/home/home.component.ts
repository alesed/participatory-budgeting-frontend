import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { HomeGateway } from './gateways/home-gateway';
import { HomeCurrentStep, HomeSchedule } from './types/home.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  _current_redirection = 'proposal';

  _isStepperReady = false;

  _description: string;
  _steps: HomeSchedule[];

  _selectedIndex: number;

  _currentButtonRoute: string[];
  _currentButtonName: string;

  constructor(
    private _state: AppStateService,
    private _gateway: HomeGateway,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.setupHomePage(this._state.subject.name);
  }

  /**
   * Load descriptipn and schedule data of stepper, get selected index of stepper and set redirect button
   * @param {string} subjectName
   */
  setupHomePage(subjectName: string): void {
    forkJoin([
      this._gateway.loadDescriptionData(subjectName),
      this._gateway.loadScheduleData(subjectName),
    ]).subscribe((data) => {
      this._description = data[0]?.description;
      this._steps = data[1];

      this._getSelectedIndex();
      this._setCurrentButtonName();
      this._setCurrentButtonRedirection();
    });
  }

  /**
   * Set route of current button to be in sync with curret step of harmonogram
   */
  private _setCurrentButtonRedirection(): void {
    this._currentButtonRoute = [
      this._state.subject.name,
      this._current_redirection,
    ];
  }

  /**
   * Translate current button name
   */
  private _setCurrentButtonName(): void {
    this._currentButtonName = this._getTranslatedButtonName();
  }

  /**
   * Decide based on DB value of schedule name what name button contains
   */
  private _getTranslatedButtonName(): string {
    switch (this._steps[this._selectedIndex].schedule_name) {
      case HomeCurrentStep.PROPOSAL:
        this._current_redirection = 'proposal';
        return 'navrhnout';
      case HomeCurrentStep.VOTE:
        this._current_redirection = 'vote';
        return 'hlasovat';
      case HomeCurrentStep.RESULT:
        this._current_redirection = 'result';
        return 'projekty';
      default:
        this._current_redirection = 'schedule';
        return 'harmonogram';
    }
  }

  /**
   * Redirect to page depending on current button state
   */
  _goToCurrentSection(): void {
    this._router.navigate(this._currentButtonRoute);
  }

  /**
   * After data of stepper fetched, decide which step is active
   */
  _getSelectedIndex(): void {
    const currentDate = new Date();
    this._selectedIndex = this._steps.length - 1;
    this._steps.forEach((element, index) => {
      if (element.date_from <= currentDate && element.date_to >= currentDate) {
        this._selectedIndex = index;
      }
    });
    this._isStepperReady = true;
  }
}
