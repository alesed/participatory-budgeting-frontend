import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsGateway } from 'src/app/pages/admin/components/settings/gateways/settings-gateway';
import { SettingsData } from 'src/app/pages/admin/components/settings/types/settings.types';
import { ScheduleGateway } from 'src/app/pages/schedule/gateways/schedule-gateway';
import { ScheduleSection } from 'src/app/pages/schedule/types/schedule.types';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from '../auth/auth.service';
import { UserDetails } from '../auth/types/auth.types';
import { SubjectGateway } from './gateways/subject-gateway';

const VOTE_SCHEDULE_NAME = 'Hlasování';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent implements OnInit {
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _state: AppStateService,
    private _gateway: SubjectGateway,
    private _settingsGateway: SettingsGateway,
    private _scheduleGateway: ScheduleGateway,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this._state.subject = { name: params['name'] };
      this._checkExistingSubjects();
      this._checkIfUserBelongsToSubject();
      this._checkIfUserCanVote();
    });
  }

  /**
   * Check if subject exists in DB
   */
  private _checkExistingSubjects(): void {
    this._gateway
      .loadDesiredSubject(this._state.subject.name)
      .subscribe((result) => {
        if (result === false) this._redirectToPageNotFound();
        this._settingsGateway
          .loadSubjectSettingsData(this._state.subject.name)
          .subscribe((result: SettingsData) => {
            this._state.logoUrl = result?.photo;
          });
      });
  }

  /**
   * Redirect from current page to 'page-not-found'
   */
  private _redirectToPageNotFound(): void {
    this._router.navigate(['/page-not-found']);
  }

  /**
   * Get currently logged user and check his subject property with current app subject
   */
  private _checkIfUserBelongsToSubject(): void {
    this._authService.getUserState().subscribe((user) => {
      if (user) {
        this._authService.getUserMetadata(user.uid).subscribe((result) => {
          const userData = result.data() as UserDetails;
          if (userData?.subject != this._state.subject.name)
            this._authService.logout();
        });
      }
    });
  }

  /**
   * Set global status of voting process
   */
  private _checkIfUserCanVote(): void {
    this._scheduleGateway
      .loadSections(this._state.subject.name)
      .subscribe((result: ScheduleSection[]) => {
        const currentDate = new Date();

        result.forEach((element: ScheduleSection) => {
          if (
            element.date_from <= currentDate &&
            element.date_to >= currentDate &&
            element.schedule_name === VOTE_SCHEDULE_NAME
          ) {
            this._state.canVote = true;
          }
        });
      });
  }
}
