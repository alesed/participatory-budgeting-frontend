import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeScheduleData } from '../types/change-schedule.types';

@Injectable()
export class ChangeScheduleGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Retrieve schedules data of subject from DB
   * @param {string} subjectName
   * @returns {ChangeScheduleData[]}
   */
  loadAllSchedulesData(subjectName: string): Observable<ChangeScheduleData[]> {
    return this._httpClient.get<ChangeScheduleData[]>(
      this.baseUrl + `/api/admin/schedule/${subjectName}`
    );
  }
}
