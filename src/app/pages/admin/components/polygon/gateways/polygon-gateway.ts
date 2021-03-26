import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PolygonCoordsData, PolygonResponse } from '../types/polygon.types';

@Injectable()
export class PolygonGateway {
  constructor(private _httpClient: HttpClient) {}

  getCurrentPolygon(subjectName: string): Observable<PolygonCoordsData> {
    return this._httpClient.get<PolygonCoordsData>(
      `/api/admin/polygon/${subjectName}`
    );
  }

  uploadNewPolygon(
    polygonData: PolygonCoordsData,
    subjectName: string
  ): Observable<PolygonResponse> {
    return this._httpClient.put<PolygonResponse>(`/api/admin/polygon/update`, {
      polygonData,
      subjectName: subjectName,
    });
  }
}
