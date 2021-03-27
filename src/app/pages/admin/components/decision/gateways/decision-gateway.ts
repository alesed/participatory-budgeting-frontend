import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DecisionProject } from '../types/decision.types';

@Injectable()
export class DecisionGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  loadDecisionProjectData(subjectName: string): Observable<DecisionProject[]> {
    return this._httpClient.get<DecisionProject[]>(
      this.baseUrl + `/api/admin/decision/${subjectName}`
    );
  }
}
