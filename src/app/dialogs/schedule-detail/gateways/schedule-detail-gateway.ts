import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ScheduleDetailCreateData,
  ScheduleDetailData,
  ScheduleDetailResponse,
} from '../types/schedule.types';

@Injectable()
export class ScheduleDetailGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  /**
   * Update schedule of subject and return success/error response
   * @param {ScheduleDetailData} createData
   * @returns {response}
   */
  updateSchedule(
    updateData: ScheduleDetailData
  ): Observable<ScheduleDetailResponse> {
    return this._httpClient.put<ScheduleDetailResponse>(
      this.baseUrl + `/api/admin/schedule/update`,
      updateData
    );
  }

  /**
   * Create new schedule of subject and return success/error response
   * @param {ScheduleDetailCreateData} createData
   * @returns {response}
   */
  createSchedule(
    createData: ScheduleDetailCreateData
  ): Observable<ScheduleDetailResponse> {
    return this._httpClient.post<ScheduleDetailResponse>(
      this.baseUrl + `/api/admin/schedule/create`,
      createData
    );
  }
}
