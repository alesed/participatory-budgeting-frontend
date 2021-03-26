import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';
import { ScheduleGateway } from './gateways/schedule-gateway';
import { ScheduleSection } from './types/schedule.types';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  _sections: ScheduleSection[];

  constructor(
    private _state: AppStateService,
    private _gateway: ScheduleGateway
  ) {}

  ngOnInit(): void {
    this._loadCurrentSchedulePage(this._state.subject.name);
  }

  /**
   * Get schedule of current subject including name, date and description
   * @param {string} subjectName
   */
  private _loadCurrentSchedulePage(subjectName: string): void {
    this._gateway
      .loadSections(subjectName)
      .subscribe((result: ScheduleSection[]) => {
        this._sections = result;
      });
  }
}
