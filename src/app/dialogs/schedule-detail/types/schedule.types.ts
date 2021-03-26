export interface ScheduleDetailData {
  schedule_id: number;
  schedule_name: string;
  date_from: Date;
  date_to: Date;
  description: string;
}

export interface ScheduleDetailCreateData {
  schedule_name: string;
  date_from: Date;
  date_to: Date;
  description: string;
  subject_name: string;
}

export interface ScheduleDetailResponse {
  success: boolean;
}
