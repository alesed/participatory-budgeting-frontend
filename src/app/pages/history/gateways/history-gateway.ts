import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HistoryProject } from '../types/history.types';

@Injectable()
export class HistoryGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  loadProjects(
    subjectName: string,
    year: number,
    category = ''
  ): Observable<HistoryProject[]> {
    return this._httpClient.post<HistoryProject[]>(
      this.baseUrl + `/api/history-projects`,
      {
        subjectName: subjectName,
        year: year,
        category: category,
      }
    );
  }
}
