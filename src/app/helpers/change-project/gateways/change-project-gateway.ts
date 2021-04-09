import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangeProjectResponse } from '../types/change-project.types';

@Injectable()
export class ChangeProjectGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Fetch subject from DB and check If subject is existing
   * @param {string} subjectName
   * @returns {Observable<boolean>}
   */
  updateDesiredProject(
    hash: string,
    projectId: number
  ): Observable<ChangeProjectResponse> {
    return this._httpClient.post<ChangeProjectResponse>(
      this.baseUrl + `/api/change-project`,
      {
        hash: hash,
        projectId: projectId,
      }
    );
  }
}
