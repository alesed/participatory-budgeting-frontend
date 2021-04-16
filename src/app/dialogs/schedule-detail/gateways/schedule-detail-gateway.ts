import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { environment } from 'src/environments/environment';
import {
  ScheduleDetailCreateData,
  ScheduleDetailData,
  ScheduleDetailResponse,
} from '../types/schedule.types';

@Injectable()
export class ScheduleDetailGateway {
  constructor(
    private _httpClient: HttpClient,
    private _state: AppStateService
  ) {}

  baseUrl = environment.baseUrl;

  /**
   * Update schedule of subject and return success/error response
   * @param {ScheduleDetailData} createData
   * @returns {response}
   */
  updateSchedule(
    updateData: ScheduleDetailData
  ): Observable<ScheduleDetailResponse> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.put<ScheduleDetailResponse>(
      this.baseUrl + `/api/admin/schedule/update`,
      updateData,
      header
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
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.post<ScheduleDetailResponse>(
      this.baseUrl + `/api/admin/schedule/create`,
      createData,
      header
    );
  }
}
