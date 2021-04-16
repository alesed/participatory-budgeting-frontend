import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { environment } from 'src/environments/environment';
import { PolygonCoordsData, PolygonResponse } from '../types/polygon.types';

@Injectable()
export class PolygonGateway {
  constructor(
    private _httpClient: HttpClient,
    private _state: AppStateService
  ) {}

  baseUrl = environment.baseUrl;

  getCurrentPolygon(subjectName: string): Observable<PolygonCoordsData> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.get<PolygonCoordsData>(
      this.baseUrl + `/api/admin/polygon/${subjectName}`,
      header
    );
  }

  uploadNewPolygon(
    polygonData: PolygonCoordsData,
    subjectName: string
  ): Observable<PolygonResponse> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.put<PolygonResponse>(
      this.baseUrl + `/api/admin/polygon/update`,
      {
        polygonData,
        subjectName: subjectName,
      },
      header
    );
  }
}
