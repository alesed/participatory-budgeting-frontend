import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SubjectGateway {
  constructor(private _httpClient: HttpClient) {
    // empty
  }

  baseUrl = environment.baseUrl;

  /**
   * Fetch subject from DB and check If subject is existing
   * @param {string} subjectName
   * @returns {Observable<boolean>}
   */
  loadDesiredSubject(subjectName: string): Observable<boolean> {
    return this._httpClient.get<boolean>(
      this.baseUrl + `/api/subject-exists/${subjectName}`
    );
  }
}
