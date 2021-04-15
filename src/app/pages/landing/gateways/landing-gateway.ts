import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContactResponse } from '../../contact/types/contact.types';
import {
  LandingContactFormData,
  LandingProposalFormData,
} from '../types/landing.types';

@Injectable()
export class LandingGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  sendProposalEmail(
    data: LandingProposalFormData
  ): Observable<ContactResponse> {
    return this._httpClient.post<ContactResponse>(
      this.baseUrl + '/api/landing/send-proposal-email',
      data
    );
  }

  sendContactEmail(data: LandingContactFormData): Observable<ContactResponse> {
    return this._httpClient.post<ContactResponse>(
      this.baseUrl + '/api/landing/send-contact-email',
      data
    );
  }
}
