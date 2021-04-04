import firebase from 'firebase/app';

export const DIALOG_WIDTH = '90%';
export const DIALOG_HEIGHT = '90%';

export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_FORMAT_VISIBLE = 'D. M. YYYY';

export const MANDATORY_SCHEDULES = ['Navrhování', 'Hlasování', 'Výsledky'];

export const SNACKBAR_CLOSE = 'Zavřít';
export const SNACKBAR_CLASS = 'success-dialog';
export const SNACKBAR_DURATION = 8000;

export const PAGE_CATEGORIES = <ProjectCategory[]>[
  { name: 'Doprava', value: 'Doprava' },
  { name: 'Děti', value: 'Deti' },
  { name: 'Kultura', value: 'Kultura' },
  { name: 'Sport', value: 'Sport' },
  { name: 'Vzdělávání', value: 'Vzdelavani' },
  { name: 'Zábava', value: 'Zabava' },
  { name: 'Zdraví', value: 'Zdravi' },
  { name: 'Zeleň', value: 'Zelen' },
  { name: 'Zvířata', value: 'Zvirata' },
  { name: 'Jiné', value: 'Jine' },
];

export enum PageSortingEnum {
  VOTES_DESC = 1,
  VOTES_ASC = 2,
  NAME_ASC = 3,
  NAME_DESC = 4,
}

export const PAGE_SORTING = <ProjectSorting[]>[
  { name: 'Počet hlasů sestupně', value: PageSortingEnum.VOTES_DESC },
  { name: 'Počet hlasů vzestupně', value: PageSortingEnum.VOTES_ASC },
  { name: 'Podle jména sestupně', value: PageSortingEnum.NAME_DESC },
  { name: 'Podle jména vzestupně', value: PageSortingEnum.NAME_ASC },
];

export interface PagesDictionary {
  code: string;
  name: string;
}

export interface ProjectCategory {
  name: string;
  value: string;
}

export interface ProjectSorting {
  name: string;
  value: number;
}

declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier;
    confirmationResult: firebase.auth.ConfirmationResult;
  }
}
