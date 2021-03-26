import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleDeleteResponse } from '../types/schedule-delete.types';

@Injectable()
export class ScheduleDeleteGateway {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Create new schedule of subject and return success/error response
   * @param {ScheduleDetailCreateData} createData
   * @returns {response}
   */
  deleteSchedule(scheduleId: number): Observable<ScheduleDeleteResponse> {
    return this._httpClient.delete<ScheduleDeleteResponse>(
      `/api/admin/schedule/delete/${scheduleId}`
    );
  }
}
