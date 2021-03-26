export enum HomeCurrentStep {
  PROPOSAL = 'Navrhování',
  VOTE = 'Hlasování',
  RESULT = 'Výsledky',
}

export interface HomeDescription {
  description: string;
}

export interface HomeSchedule {
  schedule_name: string;
  date_from: Date;
  date_to: Date;
}
