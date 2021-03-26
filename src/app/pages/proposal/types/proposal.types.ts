export enum ProposalConfirmation {
  Send = 0,
  Discard = 1,
  Nothing = 2,
}

export enum ProposalFormColumns {
  PROJECT_NAME = 'projectName',
  AUTHOR = 'author',
  AUTHOR_EMAIL = 'authorEmail',
  CATEGORY = 'category',
  DESCRIPTION = 'description',
}

export interface ProposalExpense {
  name: string;
  cost: number;
}

export interface ProposalMapClick {
  coords: {
    lat: number;
    lng: number;
  };
  placeId?: string;
}

export interface ProposalMapMarker {
  lat: number;
  lng: number;
}

export interface ProposalSendData {
  subjectName: string;
  projectName: string;
  author: string;
  authorEmail: string;
  category: string;
  description: string;
  expenses: ProposalExpense[];
  mapMarker: ProposalMapMarker;
  photo: {
    photoName: string;
    photoFirebasePath: string;
  };
}

export interface ProposalResponse {
  success: boolean;
}
