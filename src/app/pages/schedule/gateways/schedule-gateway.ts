import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleSection } from '../types/schedule.types';

@Injectable()
export class ScheduleGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  /**
   * Retrieve schedule rows from DB
   * @param {string} subjectName
   * @returns {Observable<ScheduleSection[]>}
   */
  loadSections(subjectName: string): Observable<ScheduleSection[]> {
    return this._httpClient.get<ScheduleSection[]>(
      `/api/schedule/${subjectName}`
    );
  }
}
