import { useEffect, useState } from 'react';
import { TrendingUp, Flame, Target, Moon, Zap, Award } from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Card, Skeleton, ErrorState } from './ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';

interface DayStat {
  date: string;
  total: number;
  completed: number;
  pct: number;
}

export default function InsightsScreen() {
  const { user } = useAuth();
  const { dark } = useDarkMode();
  const [days, setDays] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setError(null);
      const since = new Date();
      since.setDate(since.getDate() - 6);
      const sinceStr = since.toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('routine_progress')
        .select('date, completed')
        .eq('user_id', user.id)
        .gte('date', sinceStr);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const byDate = new Map<string, { total: number; completed: number }>();
      for (const r of data ?? []) {
        const cur = byDate.get(r.date) ?? { total: 0, completed: 0 };
        cur.total += 1;
        if (r.completed) cur.completed += 1;
        byDate.set(r.date, cur);
      }
      const out: DayStat[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().slice(0, 10);
        const stat = byDate.get(ds);
        out.push({
          date: ds,
          total: stat?.total ?? 0,
          completed: stat?.completed ?? 0,
          pct: stat && stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0,
        });
      }
      setDays(out);
      setLoading(false);
    })();
  }, [user]);

  const adherence = days.length > 0 ? Math.round(days.reduce((s, d) => s + d.pct, 0) / days.length) : 0;
  const bestDay = days.reduce((best, d) => (d.pct > best.pct ? d : best), days[0] ?? { pct: 0, date: '' });
  const completedToday = days[days.length - 1]?.completed ?? 0;

  if (loading) return <InsightsSkeleton dark={dark} />;
  if (error) return <div className="px-5 pt-8"><ErrorState message={error} /></div>;

  const dayLabels = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  const maxBar = 100;

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in-up">
      <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>I tuoi progressi</h1>
      <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Settimana in corso · aderenza al protocollo</p>

      {/* Adherence hero */}
      <Card className="p-5 mb-4 text-center">
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${dark ? 'text-night-400' : 'text-night-500'}`}>Aderenza media 7gg</p>
        <p className={`text-5xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{adherence}<span className="text-2xl">%</span></p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          <TrendingUp className="w-4 h-4 text-sage-500" />
          <span className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>Consistenza &gt; perfezione</span>
        </div>
      </Card>

      {/* Weekly chart */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>Ultimi 7 giorni</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400">settimana</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {days.map((d, i) => {
            const h = Math.max((d.pct / maxBar) * 100, 4);
            const isToday = i === days.length - 1;
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className={`text-[10px] font-bold ${dark ? 'text-night-300' : 'text-night-600'}`}>{d.pct}%</span>
                <div
                  className={`w-full rounded-lg transition-all duration-700 ${
                    isToday
                      ? 'bg-gradient-to-t from-sage-500 to-emerald-400'
                      : d.pct >= 80
                        ? 'bg-sage-400 dark:bg-sage-600'
                        : d.pct >= 40
                          ? 'bg-sage-300 dark:bg-sage-700'
                          : dark ? 'bg-night-700' : 'bg-night-200'
                  }`}
                  style={{ height: `${h}%` }}
                />
                <span className={`text-[10px] ${dark ? 'text-night-500' : 'text-night-400'}`}>{dayLabels[(new Date(d.date).getDay() + 6) % 7]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ScoreCard icon={Flame} label="Streak migliore" value={`${days.filter((d) => d.pct === 100).length}g`} tone="amber" dark={dark} />
        <ScoreCard icon={Award} label="Task completati oggi" value={`${completedToday}`} tone="sage" dark={dark} />
        <ScoreCard icon={Target} label="Giorno migliore" value={`${bestDay.pct}%`} tone="indigo" dark={dark} />
        <ScoreCard icon={Moon} label="Giorni tracciati" value={`${days.filter((d) => d.total > 0).length}`} tone="blue" dark={dark} />
      </div>

      {/* Insight card */}
      <Card className="p-4 bg-gradient-to-br from-sage-500 to-emerald-600 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-1">Insight di questa settimana</p>
            <p className="text-white/90 text-xs leading-relaxed">
              {adherence >= 80
                ? 'Aderenza eccellente. Stai costruendo abitudini solide. Mantieni il ritmo e aggiungi un nuovo task per stimolare la crescita.'
                : adherence >= 50
                  ? 'Buona base. La maggior parte dei risultati viene dal completare il 50-80% dei giorni. Punta alla streak di 3.'
                  : 'Inizia piccolo: completa solo la routine mattutina per 3 giorni di fila. Il momentum viene dalla consistenza, non dalla perfezione.'}
            </p>
          </div>
        </div>
      </Card>

      <p className={`text-center text-[10px] mt-6 ${dark ? 'text-night-600' : 'text-night-400'}`}>
        Dati basati sulle tue completazioni reali. Stime a scopo educativo.
      </p>
    </div>
  );
}

function ScoreCard({
  icon: Icon, label, value, tone, dark,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  tone: 'amber' | 'sage' | 'indigo' | 'blue';
  dark: boolean;
}) {
  const tones: Record<string, string> = {
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    sage: 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  };
  return (
    <Card className="p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${tones[tone]}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{label}</p>
      <p className={`text-xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{value}</p>
    </Card>
  );
}

function InsightsSkeleton({ dark }: { dark: boolean }) {
  return (
    <div className="px-5 pt-4 space-y-4">
      <Skeleton className={`h-32 w-full ${dark ? 'bg-night-800' : ''}`} />
      <Skeleton className={`h-52 w-full ${dark ? 'bg-night-800' : ''}`} />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className={`h-24 ${dark ? 'bg-night-800' : ''}`} />
        <Skeleton className={`h-24 ${dark ? 'bg-night-800' : ''}`} />
      </div>
    </div>
  );
}
