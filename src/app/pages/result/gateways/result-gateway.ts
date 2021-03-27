import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultProject } from '../types/result.types';

@Injectable()
export class ResultGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  loadProjects(
    subjectName: string,
    category = ''
  ): Observable<ResultProject[]> {
    return this._httpClient.post<ResultProject[]>(
      this.baseUrl + `/api/result-projects`,
      {
        subjectName: subjectName,
        category: category,
      }
    );
  }
}
