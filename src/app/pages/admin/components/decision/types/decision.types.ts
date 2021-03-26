export enum DecisionFilterCategory {
  All = 1,
  NotDecided = 2,
  Supported = 3,
  Denied = 4,
}

export interface DecisionProject {
  project_id: number;
  project_name: string;
  decision: boolean;
}
