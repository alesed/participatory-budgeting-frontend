import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScheduleDeleteResponse } from '../types/schedule-delete.types';

@Injectable()
export class ScheduleDeleteGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  /**
   * Create new schedule of subject and return success/error response
   * @param {ScheduleDetailCreateData} createData
   * @returns {response}
   */
  deleteSchedule(scheduleId: number): Observable<ScheduleDeleteResponse> {
    return this._httpClient.delete<ScheduleDeleteResponse>(
      this.baseUrl + `/api/admin/schedule/delete/${scheduleId}`
    );
  }
}
