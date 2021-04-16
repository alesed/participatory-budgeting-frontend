import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { environment } from 'src/environments/environment';
import { DecisionProject } from '../types/decision.types';

@Injectable()
export class DecisionGateway {
  constructor(
    private _httpClient: HttpClient,
    private _state: AppStateService
  ) {}

  baseUrl = environment.baseUrl;

  loadDecisionProjectData(subjectName: string): Observable<DecisionProject[]> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.get<DecisionProject[]>(
      this.baseUrl + `/api/admin/decision/${subjectName}`,
      header
    );
  }
}
