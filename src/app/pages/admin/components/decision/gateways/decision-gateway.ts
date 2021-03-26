import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DecisionProject } from '../types/decision.types';

@Injectable()
export class DecisionGateway {
  constructor(private _httpClient: HttpClient) {}

  loadDecisionProjectData(subjectName: string): Observable<DecisionProject[]> {
    return this._httpClient.get<DecisionProject[]>(
      `/api/admin/decision/${subjectName}`
    );
  }
}
