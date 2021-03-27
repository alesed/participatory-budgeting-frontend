import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScheduleSection } from '../types/schedule.types';

@Injectable()
export class ScheduleGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Retrieve schedule rows from DB
   * @param {string} subjectName
   * @returns {Observable<ScheduleSection[]>}
   */
  loadSections(subjectName: string): Observable<ScheduleSection[]> {
    return this._httpClient.get<ScheduleSection[]>(
      this.baseUrl + `/api/schedule/${subjectName}`
    );
  }
}
