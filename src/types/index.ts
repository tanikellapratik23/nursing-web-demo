export type Role = "Program Administrator" | "Nursing Faculty" | "Viewer";
export interface Scholar {
  id: string;
  name: string;
  date: string;
  status: string;
  cohort: string;
  source: string;
}
export interface Outreach {
  id: string;
  name: string;
  type: string;
  date: string;
  audience: string;
  location: string;
  reached: number;
  status: string;
}
export interface Activity {
  id: string;
  name: string;
  type: string;
  date: string;
  description: string;
  status: string;
}
export interface Participation {
  id: string;
  scholarId: string;
  activityId: string;
}
export interface Evaluation {
  id: string;
  scholarId: string;
  date: string;
  type: string;
  category: string;
  scores: number[];
  evaluator: string;
  notes: string;
  status: string;
}
export interface ClinicalLog {
  id: string;
  scholarId: string;
  date: string;
  type: string;
  hours: number;
  description: string;
  submission: string;
  status: string;
  reviewer: string;
  notes: string;
}
export interface Module {
  id: string;
  name: string;
  category: string;
  description: string;
  lessons: number;
  objectives: string[];
}
export interface Assignment {
  id: string;
  scholarId: string;
  moduleId: string;
  progress: number;
  date: string;
}
export interface Database {
  version: 1;
  scholars: Scholar[];
  outreach: Outreach[];
  activities: Activity[];
  participation: Participation[];
  evaluations: Evaluation[];
  logs: ClinicalLog[];
  assignments: Assignment[];
}
export interface Filters {
  year: string;
  quarter: string;
  status: string;
}
