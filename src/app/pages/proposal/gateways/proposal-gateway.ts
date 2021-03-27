import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProposalResponse, ProposalSendData } from '../types/proposal.types';

@Injectable()
export class ProposalGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  uploadProject(newProject: ProposalSendData): Observable<ProposalResponse> {
    return this._httpClient.post<ProposalResponse>(
      this.baseUrl + `/api/proposal/new-project`,
      newProject
    );
  }
}
