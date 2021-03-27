import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ContactFormData,
  ContactInformation,
  ContactResponse,
} from '../types/contact.types';

@Injectable()
export class ContactGateway {
  constructor(private _httpClient: HttpClient) {}

  baseUrl = environment.baseUrl;

  loadContactInformationData(
    subjectName: string
  ): Observable<ContactInformation> {
    return this._httpClient.get<ContactInformation>(
      this.baseUrl + `/api/contact/${subjectName}`
    );
  }

  sendEmail(data: ContactFormData): Observable<ContactResponse> {
    return this._httpClient.post<ContactResponse>(
      this.baseUrl + '/api/contact/send-email',
      data
    );
  }
}
