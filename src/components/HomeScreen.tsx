import { useMemo } from 'react';
import {
  Flame, Trophy, TrendingUp, Zap, Battery, Moon, Brain, Sparkles,
  ArrowRight, Check, Sun, CloudSun, Clock,
} from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Card, ProgressRing, Skeleton, ErrorState } from './ui';
import { levelFromXp, estimateImprovement } from '../lib/protocol';
import type { RoutineProgressRow, GamificationStats, Slot, OnboardingAnswers } from '../lib/types';

const slotMeta: Record<Slot, { icon: typeof Sun; label: string; color: string; ring: string }> = {
  morning: { icon: Sun, label: 'Mattina', color: 'text-amber-500', ring: '#f59e0b' },
  afternoon: { icon: CloudSun, label: 'Pomeriggio', color: 'text-sage-500', ring: '#0d9488' },
  evening: { icon: Moon, label: 'Sera', color: 'text-indigo-400', ring: '#818cf8' },
};

export default function HomeScreen({
  loading,
  error,
  activities,
  stats,
  answers,
  completedPct,
  completedBySlot,
  streakBonus,
  onGoToProtocol,
  onRetry,
}: {
  loading: boolean;
  error: string | null;
  activities: RoutineProgressRow[];
  stats: GamificationStats | null;
  answers: OnboardingAnswers | null;
  completedPct: number;
  completedBySlot: Record<string, number>;
  streakBonus?: number;
  onGoToProtocol: (slot: Slot) => void;
  onRetry: () => void;
}) {
  const { dark } = useDarkMode();
  const level = stats ? levelFromXp(stats.xp_points) : null;
  const improvements = useMemo(() => estimateImprovement(completedPct), [completedPct]);

  const todayCount = activities.filter((a) => a.completed).length;
  const totalCount = activities.length;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno';
    if (h < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  })();

  if (loading) return <HomeSkeleton dark={dark} />;

  if (error)
    return (
      <div className="px-5 pt-8">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in-up">
      {/* Greeting + streak */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className={`text-sm ${dark ? 'text-night-400' : 'text-night-500'}`}>{greeting}</p>
          <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>Protocollo di oggi</h1>
        </div>
        {stats && stats.streak_days > 0 && (
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl ${dark ? 'bg-night-800' : 'bg-white border border-night-100'}`}>
            <Flame className="w-4 h-4 text-orange-500" />
            <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{stats.streak_days}</span>
          </div>
        )}
      </div>

      {/* Hero score card */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? 'text-night-400' : 'text-night-500'}`}>Completamento oggi</p>
            <p className={`text-4xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>{completedPct}<span className="text-xl">%</span></p>
            <p className={`text-sm ${dark ? 'text-night-400' : 'text-night-500'}`}>{todayCount} di {totalCount} task</p>
          </div>
          <ProgressRing value={completedPct} size={96} stroke={10}>
            <TrendingUp className="w-6 h-6 text-sage-500" />
          </ProgressRing>
        </div>

        {/* Slot mini-rings */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-night-100 dark:border-night-700">
          {(['morning', 'afternoon', 'evening'] as Slot[]).map((slot) => {
            const meta = slotMeta[slot];
            const pct = completedBySlot[slot] ?? 0;
            return (
              <button
                key={slot}
                onClick={() => onGoToProtocol(slot)}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              >
                <ProgressRing value={pct} size={48} stroke={5} color={meta.ring}>
                  <meta.icon className={`w-4 h-4 ${meta.color}`} />
                </ProgressRing>
                <span className={`text-[10px] font-medium ${dark ? 'text-night-400' : 'text-night-500'}`}>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard icon={Battery} label="Energia" value={improvements.energy} suffix="%" tone="amber" dark={dark} />
        <MetricCard icon={Moon} label="Sonno" value={improvements.sleep} suffix="%" tone="indigo" dark={dark} />
        <MetricCard icon={Sparkles} label="Glow" value={improvements.glow} suffix="%" tone="sage" dark={dark} />
        <MetricCard icon={Brain} label="Focus" value={improvements.focus} suffix="%" tone="blue" dark={dark} />
      </div>

      {/* Gamification */}
      {level && stats && (
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`font-bold ${dark ? 'text-white' : 'text-night-900'}`}>Livello {level.level}</p>
                <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{level.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{stats.xp_points} XP</p>
              <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{streakBonus && streakBonus > 0 ? `+${streakBonus} oggi` : `${level.nextXp - stats.xp_points} al prox`}</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-night-200 dark:bg-night-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-500 to-emerald-500 transition-all duration-700"
              style={{ width: `${Math.min(level.progress, 100)}%` }}
            />
          </div>
        </Card>
      )}

      {/* AI coach card */}
      <Card className="p-4 mb-4 bg-gradient-to-br from-sage-500 to-emerald-600 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm mb-1">Il tuo coach AI</p>
            <p className="text-white/90 text-xs leading-relaxed">
              {completedPct === 0
                ? 'Inizia dalla routine mattutina: 3 task veloci che sbloccano il 40% della giornata.'
                : completedPct < 50
                  ? 'Ottimo avvio. Ora completa il blocco pomeridiano per mantenere la glicemia stabile.'
                  : completedPct < 100
                    ? 'Ci sei quasi. La routine serale è quella che più influenza il sonno di domani.'
                    : 'Giornata perfetta. Streak estesa. Domani manteniamo il ritmo.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick continue */}
      {totalCount > 0 && completedPct < 100 && (
        <Card onClick={() => onGoToProtocol('morning')} className="p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-sage-600 dark:text-sage-400" />
          </div>
          <div className="flex-1">
            <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>Continua il protocollo</p>
            <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{totalCount - todayCount} task rimasti oggi</p>
          </div>
          <ArrowRight className="w-5 h-5 text-night-400" />
        </Card>
      )}

      {totalCount > 0 && completedPct === 100 && (
        <Card className="p-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-sage-500 flex items-center justify-center mb-3">
            <Check className="w-6 h-6 text-white" />
          </div>
          <p className={`font-bold ${dark ? 'text-white' : 'text-night-900'}`}>Protocollo completato</p>
          <p className={`text-xs mt-1 ${dark ? 'text-night-400' : 'text-night-500'}`}>Streak di oggi registrata. A domani.</p>
        </Card>
      )}

      {totalCount === 0 && (
        <Card className="p-5 text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-night-400" />
          <p className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>Nessun task per oggi</p>
          <p className={`text-xs mt-1 ${dark ? 'text-night-400' : 'text-night-500'}`}>Completa l'onboarding per generare il tuo protocollo.</p>
        </Card>
      )}

      {answers && (
        <p className={`text-center text-[10px] mt-6 ${dark ? 'text-night-600' : 'text-night-400'}`}>
          Gli insight sono stimati educativi, non consigli medici.
        </p>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, suffix, tone, dark,
}: {
  icon: typeof Battery;
  label: string;
  value: number;
  suffix: string;
  tone: 'amber' | 'indigo' | 'sage' | 'blue';
  dark: boolean;
}) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    sage: 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  };
  return (
    <Card className="p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${tones[tone]}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{label}</p>
      <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>
        +{value}<span className="text-sm font-normal">{suffix}</span>
      </p>
      <p className={`text-[10px] ${dark ? 'text-night-500' : 'text-night-400'}`}>potenziale</p>
    </Card>
  );
}

function HomeSkeleton({ dark }: { dark: boolean }) {
  return (
    <div className="px-5 pt-4 space-y-4">
      <Skeleton className={`h-8 w-40 ${dark ? 'bg-night-800' : ''}`} />
      <Skeleton className={`h-44 w-full ${dark ? 'bg-night-800' : ''}`} />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className={`h-24 ${dark ? 'bg-night-800' : ''}`} />
        <Skeleton className={`h-24 ${dark ? 'bg-night-800' : ''}`} />
      </div>
      <Skeleton className={`h-20 w-full ${dark ? 'bg-night-800' : ''}`} />
    </div>
  );
}
