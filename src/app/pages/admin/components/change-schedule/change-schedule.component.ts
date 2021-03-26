import * as moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleDeleteComponent } from 'src/app/dialogs/schedule-delete/schedule-delete.component';
import { ScheduleDetailComponent } from 'src/app/dialogs/schedule-detail/schedule-detail.component';
import { AppStateService } from 'src/app/services/app-state.service';
import { ChangeScheduleGateway } from './gateways/change-schedule-gateways';
import { ChangeScheduleData } from './types/change-schedule.types';
import {
  DATE_FORMAT_VISIBLE,
  MANDATORY_SCHEDULES,
  SNACKBAR_CLASS,
  SNACKBAR_CLOSE,
  SNACKBAR_DURATION,
} from 'src/app/shared/types/shared.types';
import { MatSnackBar } from '@angular/material/snack-bar';

const DELETE_SUCCESS = 'Smazání harmonogramu úspěšně dokončeno!';
const DELETE_ERROR = 'Při mazání harmonogramu došlo k chybě!';

const ADD_SUCCESS = 'Přidání harmonogramu úspěšně dokončeno!';
const ADD_ERROR = 'Při přidávání harmonogramu došlo k chybě!';

const CHANGE_SUCCESS = 'Změna harmonogramu úspěšně dokončeno!';
const CHANGE_ERROR = 'Při změně harmonogramu došlo k chybě!';

@Component({
  selector: 'app-change-schedule',
  templateUrl: './change-schedule.component.html',
  styleUrls: ['./change-schedule.component.scss'],
})
export class ChangeScheduleComponent implements OnInit {
  _scheduleItems: ChangeScheduleData[] = [];

  constructor(
    public _dialog: MatDialog,
    private _gateway: ChangeScheduleGateway,
    private _state: AppStateService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._loadAllSchedules(this._state.subject.name);
  }

  /**
   * Get all schedules of subject
   * @param {string} subjectName
   */
  _loadAllSchedules(subjectName: string): void {
    this._gateway.loadAllSchedulesData(subjectName).subscribe((result) => {
      this._scheduleItems = result;
    });
  }

  /**
   * Transform JS Date to string according to project date format
   * @param {Date} date
   * @returns {string}
   */
  _formatDate(date: Date): string {
    return moment(date).format(DATE_FORMAT_VISIBLE);
  }

  /**
   * Open dialog where user can change name/date/description
   * @param {number} id
   */
  _changeSchedule(item: ChangeScheduleData): void {
    const dialogRef = this._dialog.open(ScheduleDetailComponent, {
      disableClose: true,
      data: item,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this._loadAllSchedules(this._state.subject.name);
        this._snackBar.open(CHANGE_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      } else if (success === false) {
        this._snackBar.open(CHANGE_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Open confirmation dialog if user really wants to delete schedule
   * @param {ChangeScheduleData} item
   */
  _deleteSchedule(item: ChangeScheduleData): void {
    const dialogRef = this._dialog.open(ScheduleDeleteComponent, {
      disableClose: true,
      data: item,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this._loadAllSchedules(this._state.subject.name);
        this._snackBar.open(DELETE_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      } else if (success === false) {
        this._snackBar.open(DELETE_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Open create new schedule dialog and after closed reload schedules
   */
  _addSchedule(): void {
    const dialogRef = this._dialog.open(ScheduleDetailComponent, {
      disableClose: true,
      data: null,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this._loadAllSchedules(this._state.subject.name);
        this._snackBar.open(ADD_SUCCESS, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      } else if (success === false) {
        this._snackBar.open(ADD_ERROR, SNACKBAR_CLOSE, {
          duration: SNACKBAR_DURATION,
          panelClass: SNACKBAR_CLASS,
        });
      }
    });
  }

  /**
   * Check if schedule is included in mandatory schedules (cant be renamed/removed)
   */
  _isMandatory(scheduleName: string): boolean {
    return !MANDATORY_SCHEDULES.includes(scheduleName);
  }
}
