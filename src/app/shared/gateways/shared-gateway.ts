import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class SharedGateway {
  constructor(private _httpClient: HttpClient) {}

  loadNavigationHistoryYears(subjectName: string): Observable<number[]> {
    return this._httpClient.get<number[]>(
      `/api/shared/historic-years/${subjectName}`
    );
  }
}
