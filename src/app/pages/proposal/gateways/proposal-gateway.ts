import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProposalResponse, ProposalSendData } from '../types/proposal.types';

@Injectable()
export class ProposalGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  uploadProject(newProject: ProposalSendData): Observable<ProposalResponse> {
    return this._httpClient.post<ProposalResponse>(
      `/api/proposal/new-project`,
      newProject
    );
  }
}
