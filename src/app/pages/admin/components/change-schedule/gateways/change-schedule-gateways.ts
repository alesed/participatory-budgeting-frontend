import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { environment } from 'src/environments/environment';
import { ChangeScheduleData } from '../types/change-schedule.types';

@Injectable()
export class ChangeScheduleGateway {
  constructor(
    private _httpClient: HttpClient,
    private _state: AppStateService
  ) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Retrieve schedules data of subject from DB
   * @param {string} subjectName
   * @returns {ChangeScheduleData[]}
   */
  loadAllSchedulesData(subjectName: string): Observable<ChangeScheduleData[]> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.get<ChangeScheduleData[]>(
      this.baseUrl + `/api/admin/schedule/${subjectName}`,
      header
    );
  }
}
