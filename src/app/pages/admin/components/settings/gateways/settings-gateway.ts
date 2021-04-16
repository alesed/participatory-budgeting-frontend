import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';
import { environment } from 'src/environments/environment';
import {
  SettingsData,
  SettingsPhotoData,
  SettingsResponse,
} from '../types/settings.types';

@Injectable()
export class SettingsGateway {
  constructor(
    private _httpClient: HttpClient,
    private _state: AppStateService
  ) {}

  baseUrl = environment.baseUrl;

  loadSubjectSettingsData(subjectName: string): Observable<SettingsData> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.get<SettingsData>(
      this.baseUrl + `/api/admin/settings/${subjectName}`,
      header
    );
  }

  updateSubjectLogo(
    subjectName: string,
    photoUrl: string
  ): Observable<SettingsResponse> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._state.userToken}`
      ),
    };

    return this._httpClient.put<SettingsResponse>(
      this.baseUrl + `/api/admin/settings/photo`,
      <SettingsPhotoData>{
        subjectName: subjectName,
        subjectPhotoUrl: photoUrl,
      },
      header
    );
  }
}
