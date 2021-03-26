import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DetailExpensesData,
  DetailPhotoData,
  DetailProjectData,
  DetailResponse,
} from '../types/detail.types';

@Injectable()
export class DetailGateway {
  constructor(private _httpClient: HttpClient) {}

  loadDetailProjectData(projectId: number): Observable<DetailProjectData> {
    return this._httpClient.get<DetailProjectData>(
      `/api/detail-project/${projectId}`
    );
  }

  loadDetailProjectPhotoData(projectId: number): Observable<DetailPhotoData> {
    return this._httpClient.get<DetailPhotoData>(
      `/api/detail-project/photo/${projectId}`
    );
  }

  loadDetailProjectExpensesData(
    projectId: number
  ): Observable<DetailExpensesData[]> {
    return this._httpClient.get<DetailExpensesData[]>(
      `/api/detail-project/expenses/${projectId}`
    );
  }

  updateProjectDecision(
    projectId: number,
    decision: boolean,
    decisionText: string
  ): Observable<DetailResponse> {
    return this._httpClient.post<DetailResponse>('/api/detail-project/decide', {
      projectId: projectId,
      decision: decision,
      decisionText: decisionText,
    });
  }
}
