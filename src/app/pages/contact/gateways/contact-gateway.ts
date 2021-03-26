import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContactFormData,
  ContactInformation,
  ContactResponse,
} from '../types/contact.types';

@Injectable()
export class ContactGateway {
  constructor(private _httpClient: HttpClient) {}

  loadContactInformationData(
    subjectName: string
  ): Observable<ContactInformation> {
    return this._httpClient.get<ContactInformation>(
      `/api/contact/${subjectName}`
    );
  }

  sendEmail(data: ContactFormData): Observable<ContactResponse> {
    return this._httpClient.post<ContactResponse>(
      '/api/contact/send-email',
      data
    );
  }
}
