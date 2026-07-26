import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { generateProtocol, levelFromXp } from './protocol';
import type {
  OnboardingAnswers,
  ProtocolActivity,
  RoutineProgressRow,
  GamificationStats,
  GeneratedProtocol,
} from './types';

const todayStr = () => new Date().toISOString().slice(0, 10);

interface UseProtocolResult {
  loading: boolean;
  error: string | null;
  activities: RoutineProgressRow[];
  protocol: GeneratedProtocol | null;
  stats: GamificationStats | null;
  level: ReturnType<typeof levelFromXp> | null;
  completedPct: number;
  completedBySlot: Record<string, number>;
  toggle: (activityId: string, slot: RoutineProgressRow['slot']) => Promise<void>;
  ensureToday: (answers: OnboardingAnswers) => Promise<void>;
}

export function useDailyProtocol(userId: string | undefined, answers: OnboardingAnswers | null): UseProtocolResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<RoutineProgressRow[]>([]);
  const [protocol, setProtocol] = useState<GeneratedProtocol | null>(null);
  const [stats, setStats] = useState<GamificationStats | null>(null);

  const loadStats = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from('gamification_stats')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();
    if (error) return;
    if (data) setStats(data as GamificationStats);
  }, []);

  const loadToday = useCallback(async (uid: string) => {
    const today = todayStr();
    const { data, error } = await supabase
      .from('routine_progress')
      .select('*')
      .eq('user_id', uid)
      .eq('date', today);
    if (error) {
      setError(error.message);
      return;
    }
    setRows((data as RoutineProgressRow[]) ?? []);
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([loadToday(userId), loadStats(userId)]).finally(() => setLoading(false));
  }, [userId, loadToday, loadStats]);

  const ensureToday = useCallback(
    async (ans: OnboardingAnswers) => {
      if (!userId) return;
      const generated = generateProtocol(ans);
      setProtocol(generated);
      const today = todayStr();
      const { data: existing } = await supabase
        .from('routine_progress')
        .select('id, activity_id, slot')
        .eq('user_id', userId)
        .eq('date', today);
      const have = new Set((existing ?? []).map((r: { activity_id: string; slot: string }) => `${r.activity_id}|${r.slot}`));
      const toInsert = generated.activities
        .filter((a) => !have.has(`${a.id}|${a.slot}`))
        .map((a: ProtocolActivity) => ({
          user_id: userId,
          activity_id: a.id,
          activity_name: a.name,
          slot: a.slot,
          category: a.category,
          xp: a.xp,
          duration: a.duration,
          completed: false,
          date: today,
        }));
      if (toInsert.length > 0) {
        await supabase.from('routine_progress').insert(toInsert);
      }
      await loadToday(userId);
    },
    [userId, loadToday]
  );

  const bumpStats = useCallback(
    async (uid: string, xpDelta: number, fullyComplete: boolean) => {
      const { data } = await supabase
        .from('gamification_stats')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();
      const current = (data as GamificationStats) ?? {
        xp_points: 0,
        streak_days: 0,
        last_completion_date: null,
        level: 1,
      };
      const newXp = Math.max(0, current.xp_points + xpDelta);
      const today = todayStr();
      let newStreak = current.streak_days;
      if (fullyComplete) {
        if (current.last_completion_date !== today) {
          newStreak = current.streak_days + 1;
        }
      }
      const upsert = {
        user_id: uid,
        xp_points: newXp,
        streak_days: newStreak,
        last_completion_date: fullyComplete ? today : current.last_completion_date,
        level: levelFromXp(newXp).level,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('gamification_stats').upsert(upsert);
      await loadStats(uid);
    },
    [loadStats]
  );

  const toggle = useCallback(
    async (activityId: string, slot: RoutineProgressRow['slot']) => {
      if (!userId) return;
      const row = rows.find((r) => r.activity_id === activityId && r.slot === slot);
      if (!row) return;
      const newCompleted = !row.completed;
      const xpDelta = newCompleted ? row.xp : -row.xp;

      setRows((prev) =>
        prev.map((r) =>
          r.activity_id === activityId && r.slot === slot ? { ...r, completed: newCompleted } : r
        )
      );

      const { error: updErr } = await supabase
        .from('routine_progress')
        .update({ completed: newCompleted, updated_at: new Date().toISOString() })
        .eq('id', row.id);
      if (updErr) {
        setRows((prev) =>
          prev.map((r) =>
            r.activity_id === activityId && r.slot === slot ? { ...r, completed: !newCompleted } : r
          )
        );
        setError(updErr.message);
        return;
      }

      const allComplete = rows.every((r) =>
        r.activity_id === activityId && r.slot === slot ? newCompleted : r.completed
      );
      await bumpStats(userId, xpDelta, allComplete && newCompleted);
    },
    [userId, rows, bumpStats]
  );

  const completedPct =
    rows.length === 0 ? 0 : Math.round((rows.filter((r) => r.completed).length / rows.length) * 100);

  const completedBySlot = (['morning', 'afternoon', 'evening'] as const).reduce(
    (acc, s) => {
      const slotRows = rows.filter((r) => r.slot === s);
      acc[s] = slotRows.length === 0 ? 0 : Math.round((slotRows.filter((r) => r.completed).length / slotRows.length) * 100);
      return acc;
    },
    {} as Record<string, number>
  );

  const level = stats ? levelFromXp(stats.xp_points) : null;

  return {
    loading,
    error,
    activities: rows,
    protocol,
    stats,
    level,
    completedPct,
    completedBySlot,
    toggle,
    ensureToday,
  };
}
