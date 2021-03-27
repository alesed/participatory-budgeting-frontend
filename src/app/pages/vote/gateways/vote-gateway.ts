import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VoteProject } from '../types/vote.types';

@Injectable()
export class VoteGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  loadProjects(subjectName: string, category = ''): Observable<VoteProject[]> {
    return this._httpClient.post<VoteProject[]>(
      this.baseUrl + `/api/vote-projects`,
      {
        subjectName: subjectName,
        category: category,
      }
    );
  }
}
