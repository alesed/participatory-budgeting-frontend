import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  DetailExpensesData,
  DetailPhotoData,
  DetailProjectData,
  DetailResponse,
} from '../types/detail.types';

@Injectable()
export class DetailGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  loadDetailProjectData(projectId: number): Observable<DetailProjectData> {
    return this._httpClient.get<DetailProjectData>(
      this.baseUrl + `/api/detail-project/${projectId}`
    );
  }

  loadDetailProjectPhotoData(projectId: number): Observable<DetailPhotoData> {
    return this._httpClient.get<DetailPhotoData>(
      this.baseUrl + `/api/detail-project/photo/${projectId}`
    );
  }

  loadDetailProjectExpensesData(
    projectId: number
  ): Observable<DetailExpensesData[]> {
    return this._httpClient.get<DetailExpensesData[]>(
      this.baseUrl + `/api/detail-project/expenses/${projectId}`
    );
  }

  updateProjectDecision(
    projectId: number,
    decision: boolean,
    decisionText: string
  ): Observable<DetailResponse> {
    return this._httpClient.post<DetailResponse>(
      this.baseUrl + '/api/detail-project/decide',
      {
        projectId: projectId,
        decision: decision,
        decisionText: decisionText,
      }
    );
  }

  sendProjectUpdateAcceptation(
    subjectName: string,
    projectData: DetailProjectData,
    projectExpenses: DetailExpensesData[]
  ): Observable<DetailResponse> {
    console.log(projectData);
    console.log(projectExpenses);
    return this._httpClient.post<DetailResponse>(
      this.baseUrl + '/api/detail-project/update',
      {
        subjectName: subjectName,
        projectData: projectData,
        projectExpenses: projectExpenses,
        baseUrl: location.origin,
      }
    );
  }
}
