import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeDescription, HomeSchedule } from '../types/home.types';

@Injectable()
export class HomeGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Retrieve home description row from DB
   * @param {string} subjectName
   * @returns {Observable<HomeDescription>}
   */
  loadDescriptionData(subjectName: string): Observable<HomeDescription> {
    return this._httpClient.get<HomeDescription>(
      this.baseUrl + `/api/home/description/${subjectName}`
    );
  }

  /**
   * Retrieve home schedule rows from DB
   * @param {string} subjectName
   * @returns {Observable<HomeSchedule[]>}
   */
  loadScheduleData(subjectName: string): Observable<HomeSchedule[]> {
    return this._httpClient.get<HomeSchedule[]>(
      this.baseUrl + `/api/home/schedule/${subjectName}`
    );
  }
}
