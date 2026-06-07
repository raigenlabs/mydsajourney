import { WeekPlan } from './data';

export interface ProgressState {
  completed: Record<string, boolean>; // key: "weekIndex-dayIndex-problemIndex"
  updatedAt: string;
  updatedBy: string;
}

export interface Stats {
  total: number;
  completedCount: number;
  remainingCount: number;
  percentage: number;
}

export interface WeekStats {
  weekIndex: number;
  weekName: string;
  total: number;
  completedCount: number;
  percentage: number;
}
