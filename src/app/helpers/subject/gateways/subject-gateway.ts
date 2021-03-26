import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SubjectGateway {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Fetch subject from DB and check If subject is existing
   * @param {string} subjectName
   * @returns {Observable<boolean>}
   */
  loadDesiredSubject(subjectName: string): Observable<boolean> {
    return this._httpClient.get<boolean>(`/api/subject-exists/${subjectName}`);
  }
}
