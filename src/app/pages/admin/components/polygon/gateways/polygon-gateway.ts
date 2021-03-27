import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PolygonCoordsData, PolygonResponse } from '../types/polygon.types';

@Injectable()
export class PolygonGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  getCurrentPolygon(subjectName: string): Observable<PolygonCoordsData> {
    return this._httpClient.get<PolygonCoordsData>(
      this.baseUrl + `/api/admin/polygon/${subjectName}`
    );
  }

  uploadNewPolygon(
    polygonData: PolygonCoordsData,
    subjectName: string
  ): Observable<PolygonResponse> {
    return this._httpClient.put<PolygonResponse>(
      this.baseUrl + `/api/admin/polygon/update`,
      {
        polygonData,
        subjectName: subjectName,
      }
    );
  }
}
