import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppStateService } from 'src/app/services/app-state.service';
import { MANDATORY_SCHEDULES } from 'src/app/shared/types/shared.types';
import { ScheduleDetailGateway } from './gateways/schedule-detail-gateway';
import {
  ScheduleDetailCreateData,
  ScheduleDetailData,
  ScheduleDetailResponse,
} from './types/schedule.types';

const DEFAULT_SUCCESS_BUTTON = 'Upravit';
const CREATE_SUCCESS_BUTTON = 'Vytvořit';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss'],
})
export class ScheduleDetailComponent implements OnInit {
  _successButton = DEFAULT_SUCCESS_BUTTON;

  _scheduleForm: FormGroup;

  constructor(
    public _dialogRef: MatDialogRef<ScheduleDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleDetailData,
    private _gateway: ScheduleDetailGateway,
    private _state: AppStateService
  ) {}

  ngOnInit(): void {
    if (this.data) this._getScheduleData();
    else {
      this._changeDialogToCreateVersion();
    }
  }

  /**
   * Initialize new form with values passed from change schedule component
   */
  private _getScheduleData(): void {
    this._scheduleForm = new FormGroup({
      id: new FormControl(this.data.schedule_id, [Validators.required]),
      dateFrom: new FormControl(new Date(this.data.date_from), [
        Validators.required,
      ]),
      dateTo: new FormControl(new Date(this.data.date_to), [
        Validators.required,
      ]),
      name: new FormControl(this.data.schedule_name, [Validators.required]),
      description: new FormControl(this.data.description, [
        Validators.required,
      ]),
    });
  }

  /**
   * Change success button and initialize form with empty values
   */
  private _changeDialogToCreateVersion(): void {
    this._successButton = CREATE_SUCCESS_BUTTON;

    this._scheduleForm = new FormGroup({
      id: new FormControl(null, []),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Set values of ScheduleDetailData, send to DB, update row and close dialog
   */
  _updateSchedule(): void {
    const updateData = <ScheduleDetailData>{
      schedule_id: this._scheduleForm.controls.id.value,
      schedule_name: this._scheduleForm.controls.name.value,
      date_from: new Date(this._scheduleForm.controls.dateFrom.value),
      date_to: new Date(this._scheduleForm.controls.dateTo.value),
      description: this._scheduleForm.controls.description.value,
    };

    this._gateway
      .updateSchedule(updateData)
      .subscribe((result: ScheduleDetailResponse) => {
        if (result.success) this._dialogRef.close(true);
        else this._dialogRef.close(false);
      });
  }

  /**
   * Set values of ScheduleDetailCreateData, send to DB, create row and close dialog
   */
  _createSchedule(): void {
    const createData = <ScheduleDetailCreateData>{
      schedule_name: this._scheduleForm.controls.name.value,
      date_from: new Date(this._scheduleForm.controls.dateFrom.value),
      date_to: new Date(this._scheduleForm.controls.dateTo.value),
      description: this._scheduleForm.controls.description.value,
      subject_name: this._state.subject.name,
    };

    this._gateway
      .createSchedule(createData)
      .subscribe((result: ScheduleDetailResponse) => {
        if (result.success) this._dialogRef.close(true);
        else this._dialogRef.close(false);
      });
  }

  /**
   * Close dialog and return to ChangeScheduleComponent
   */
  _closeDialog(): void {
    this._dialogRef.close();
  }

  /**
   * Check if schedule is included in mandatory schedules (cant be renamed/removed)
   */
  _isMandatory(): boolean {
    return MANDATORY_SCHEDULES.includes(this.data?.schedule_name);
  }
}
