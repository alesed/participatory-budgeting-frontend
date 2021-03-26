export interface ContactData {
  informations: ContactInformations;
  social_sites: ContactSocialSite[];
}

export interface ContactInformations {
  name: string;
  place: string;
  mail: string;
  phone: string;
}

export enum SocialSiteTypes {
  Facebook = 'facebook',
  Instagram = 'instagram',
}

export interface ContactSocialSite {
  type: SocialSiteTypes.Facebook | SocialSiteTypes.Instagram;
  url: string;
}

export interface ContactInformation {
  author: string;
  address: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
}

export interface ContactSocialSite {
  name: string;
  url: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  subjectEmail?: string;
}

export interface ContactResponse {
  success: boolean;
}
