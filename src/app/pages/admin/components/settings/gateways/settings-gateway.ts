import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SettingsData,
  SettingsPhotoData,
  SettingsResponse,
} from '../types/settings.types';

@Injectable()
export class SettingsGateway {
  constructor(private _httpClient: HttpClient) {}

  loadSubjectSettingsData(subjectName: string): Observable<SettingsData> {
    return this._httpClient.get<SettingsData>(
      `/api/admin/settings/${subjectName}`
    );
  }

  updateSubjectLogo(
    subjectName: string,
    photoUrl: string
  ): Observable<SettingsResponse> {
    return this._httpClient.put<SettingsResponse>(`/api/admin/settings/photo`, <
      SettingsPhotoData
    >{ subjectName: subjectName, subjectPhotoUrl: photoUrl });
  }
}
