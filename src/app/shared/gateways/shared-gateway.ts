import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class SharedGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  loadNavigationHistoryYears(subjectName: string): Observable<number[]> {
    return this._httpClient.get<number[]>(
      this.baseUrl + `/api/shared/historic-years/${subjectName}`
    );
  }
}
