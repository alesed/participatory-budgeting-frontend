export interface SettingsConfirmationData {
  subject_id: number;
  description: string;
  author: string;
  address: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
}

export interface SettingsConfirmationResponse {
  success: boolean;
}
