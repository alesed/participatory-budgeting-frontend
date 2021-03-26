import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResultProject } from '../types/result.types';

@Injectable()
export class ResultGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  loadProjects(
    subjectName: string,
    category = ''
  ): Observable<ResultProject[]> {
    return this._httpClient.post<ResultProject[]>(`/api/result-projects`, {
      subjectName: subjectName,
      category: category,
    });
  }
}
