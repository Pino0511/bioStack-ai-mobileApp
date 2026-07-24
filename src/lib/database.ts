import { supabase } from './supabase';

export interface Profile {
  id: string;
  name: string;
  age: number;
  skin_type: 'dry' | 'oily' | 'combination' | null;
  goal: 'skincare' | 'posture' | 'focus' | null;
  budget: 'low' | 'medium' | 'elite' | null;
  is_premium: boolean;
  subscription_plan: 'annual' | 'monthly';
  dark_mode: boolean;
  language: 'it' | 'en';
}

export interface GamificationStats {
  xp_points: number;
  streak_days: number;
  last_completion_date: string | null;
  level: number;
}

export interface RoutineRow {
  activity_id: string;
  activity_name: string;
  is_morning: boolean;
  completed: boolean;
  date: string;
}

export async function fetchProfile(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function upsertProfile(userId: string, patch: Partial<Profile>) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...patch, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function fetchGamification(userId: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('gamification_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as GamificationStats | null;
}

export async function upsertGamification(userId: string, patch: Partial<GamificationStats>) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('gamification_stats')
    .upsert({ user_id: userId, ...patch, updated_at: new Date().toISOString() })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data as GamificationStats | null;
}

export async function fetchRoutineToday(userId: string) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('routine_progress')
    .select('activity_id, activity_name, is_morning, completed, date')
    .eq('user_id', userId)
    .eq('date', new Date().toISOString().slice(0, 10));
  if (error) throw error;
  return (data || []) as RoutineRow[];
}

export async function upsertRoutineRow(
  userId: string,
  activityId: string,
  activityName: string,
  isMorning: boolean,
  completed: boolean
) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('routine_progress')
    .upsert({
      user_id: userId,
      activity_id: activityId,
      activity_name: activityName,
      is_morning: isMorning,
      completed,
      date: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,activity_id,date' })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}
