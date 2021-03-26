import { Injectable } from '@angular/core';
import { SubjectData } from '../helpers/subject/types/subject.types';

@Injectable()
export class AppStateService {
  subject: SubjectData;
  logoUrl: string;
  canVote = false;
}
