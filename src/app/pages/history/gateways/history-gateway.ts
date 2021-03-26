import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryProject } from '../types/history.types';

@Injectable()
export class HistoryGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  loadProjects(
    subjectName: string,
    year: number,
    category = ''
  ): Observable<HistoryProject[]> {
    return this._httpClient.post<HistoryProject[]>(`/api/history-projects`, {
      subjectName: subjectName,
      year: year,
      category: category,
    });
  }
}
