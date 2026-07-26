export type GoalId = 'skincare' | 'posture' | 'focus' | 'longevity' | 'energy' | 'body';
export type Sex = 'male' | 'female' | 'other';
export type Budget = 'low' | 'medium' | 'elite';
export type SkinType = 'dry' | 'oily' | 'combination' | 'normal';
export type Slot = 'morning' | 'afternoon' | 'evening';
export type ActivityCategory =
  | 'habit'
  | 'nutrition'
  | 'supplement'
  | 'recovery'
  | 'skincare'
  | 'movement';

export interface OnboardingAnswers {
  goal: GoalId;
  secondaryGoals: GoalId[];
  sex?: Sex;
  age: number;
  energyLevel: number; // 1-5
  sleepQuality: number; // 1-5
  stressLevel: number; // 1-5
  workoutFrequency: number; // 0-7 days/week
  skinType?: SkinType;
  limitations?: string[];
}

export interface ProtocolActivity {
  id: string;
  name: string;
  duration: string;
  xp: number;
  slot: Slot;
  category: ActivityCategory;
  why: string;
}

export interface ProtocolStackItem {
  id: string;
  name: string;
  type: 'habit' | 'nutrition' | 'supplement' | 'recovery';
  timing: string;
  note: string;
  safety?: string;
  consultPro?: boolean;
}

export interface GeneratedProtocol {
  score: number;
  priorities: { title: string; detail: string }[];
  activities: ProtocolActivity[];
  stack: ProtocolStackItem[];
}

export interface RoutineProgressRow {
  id: string;
  activity_id: string;
  activity_name: string;
  slot: Slot;
  category: ActivityCategory;
  xp: number;
  duration: string | null;
  completed: boolean;
  date: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  goal: GoalId | null;
  budget: Budget | null;
  skin_type: SkinType | null;
  is_premium: boolean;
  dark_mode: boolean;
  onboarding: Partial<OnboardingAnswers> | null;
  secondary_goals: GoalId[] | null;
  sex: Sex | null;
  energy_level: number | null;
  sleep_quality: number | null;
}

export interface GamificationStats {
  xp_points: number;
  streak_days: number;
  last_completion_date: string | null;
  level: number;
}
