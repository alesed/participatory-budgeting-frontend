import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VoteProject } from '../types/vote.types';

@Injectable()
export class VoteGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  loadProjects(subjectName: string, category = ''): Observable<VoteProject[]> {
    return this._httpClient.post<VoteProject[]>(`/api/vote-projects`, {
      subjectName: subjectName,
      category: category,
    });
  }
}
