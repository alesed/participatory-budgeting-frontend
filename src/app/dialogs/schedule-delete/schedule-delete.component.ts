import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeScheduleData } from 'src/app/pages/admin/components/change-schedule/types/change-schedule.types';
import { ScheduleDeleteGateway } from './gateways/schedule-delete-gateway';
import { ScheduleDeleteResponse } from './types/schedule-delete.types';

@Component({
  selector: 'app-schedule-delete',
  templateUrl: './schedule-delete.component.html',
  styleUrls: ['./schedule-delete.component.scss'],
})
export class ScheduleDeleteComponent implements OnInit {
  _scheduleName: string;

  constructor(
    public _dialogRef: MatDialogRef<ScheduleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangeScheduleData,
    private _gateway: ScheduleDeleteGateway
  ) {}

  ngOnInit(): void {
    this._getScheduleName();
  }

  private _getScheduleName(): void {
    this._scheduleName = this.data.schedule_name;
  }

  _closeDialog(): void {
    this._dialogRef.close();
  }

  _deleteSchedule(): void {
    this._gateway
      .deleteSchedule(this.data.schedule_id)
      .subscribe((result: ScheduleDeleteResponse) => {
        if (result.success) this._dialogRef.close(true);
        else this._dialogRef.close(false);
      });
  }
}
