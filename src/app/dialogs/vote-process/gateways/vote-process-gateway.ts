import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteProcessResponse } from '../types/vote-process.types';

@Injectable()
export class VoteProcessGateway {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Vote for specific project of subject with one vote
   * @param {string} phoneNumber
   * @param {number} projectId
   * @returns {response}
   */
  voteForProject(
    subjectName: string,
    phoneNumber: string,
    projectId: number
  ): Observable<VoteProcessResponse> {
    return this._httpClient.post<VoteProcessResponse>(`/api/vote/project`, {
      subjectName: subjectName,
      phoneNumber: phoneNumber,
      projectId: projectId,
    });
  }

  checkVotes(phoneNumber: string): Observable<VoteProcessResponse> {
    return this._httpClient.post<VoteProcessResponse>(`/api/vote/check`, {
      phoneNumber: phoneNumber,
    });
  }
}
