import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SettingsConfirmationData,
  SettingsConfirmationResponse,
} from '../types/settings-confirmation.types';

@Injectable()
export class SettingsConfirmationGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  /**
   * Update settings of subject and return success/error response
   * @param {SettingsConfirmationData} updateSettings
   * @returns {response}
   */
  updateSettings(
    updateSettings: SettingsConfirmationData
  ): Observable<SettingsConfirmationResponse> {
    return this._httpClient.put<SettingsConfirmationResponse>(
      this.baseUrl + `/api/admin/settings/update`,
      updateSettings
    );
  }
}
