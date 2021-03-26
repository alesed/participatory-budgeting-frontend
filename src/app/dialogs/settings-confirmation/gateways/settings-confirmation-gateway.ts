import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SettingsConfirmationData,
  SettingsConfirmationResponse,
} from '../types/settings-confirmation.types';

@Injectable()
export class SettingsConfirmationGateway {
  constructor(private _httpClient: HttpClient) {}

  /**
   * Update settings of subject and return success/error response
   * @param {SettingsConfirmationData} updateSettings
   * @returns {response}
   */
  updateSettings(
    updateSettings: SettingsConfirmationData
  ): Observable<SettingsConfirmationResponse> {
    return this._httpClient.put<SettingsConfirmationResponse>(
      `/api/admin/settings/update`,
      updateSettings
    );
  }
}
