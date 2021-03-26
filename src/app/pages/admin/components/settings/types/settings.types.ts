export interface SettingsData {
  subject_id: number;
  description: string;
  author: string;
  address: string;
  email: string;
  phone: string;
  photo: string;
  facebook_url: string;
  instagram_url: string;
}

export interface SettingsPhotoData {
  subjectName: string;
  subjectPhotoUrl: string;
}

export interface SettingsResponse {
  success: boolean;
}
