export interface DetailDialogData {
  dialogType: DetailDialogType;
  projectId: number;
}
export interface DetailExpenses {
  name: string;
  cost: number;
}

export enum DetailDialogType {
  Vote = 1,
  Admin = 2,
  Result = 3,
}

export interface DetailProjectData {
  project_id: number;
  project_name: string;
  author: string;
  author_email: string;
  date_created: string;
  category: string;
  description: string;
  geo_latitude: number;
  geo_longtitude: number;
  decision: boolean;
  decision_text: string;
}

export interface DetailPhotoData {
  photo_name: string;
  photo_path: string;
}

export interface DetailExpensesData {
  expense_name: string;
  expense_cost: number;
}

export interface DetailResponse {
  success: boolean;
}
