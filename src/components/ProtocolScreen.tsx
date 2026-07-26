import { useState } from 'react';
import {
  Sun, CloudSun, Moon, Check, Clock, ChevronDown, Sparkles, Info,
} from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Card, ProgressRing, EmptyState } from './ui';
import type { RoutineProgressRow, Slot, ActivityCategory } from '../lib/types';

const slotMeta: Record<Slot, { icon: typeof Sun; label: string; sub: string; color: string; ring: string; bg: string }> = {
  morning: { icon: Sun, label: 'Mattina', sub: 'Avvia la giornata', color: 'text-amber-500', ring: '#f59e0b', bg: 'from-amber-400 to-amber-600' },
  afternoon: { icon: CloudSun, label: 'Pomeriggio', sub: "Mantieni l'energia", color: 'text-sage-500', ring: '#0d9488', bg: 'from-sage-500 to-emerald-600' },
  evening: { icon: Moon, label: 'Sera', sub: 'Recupero & sonno', color: 'text-indigo-400', ring: '#818cf8', bg: 'from-indigo-400 to-indigo-600' },
};

const categoryLabel: Record<ActivityCategory, string> = {
  habit: 'Abitudine',
  nutrition: 'Nutrizione',
  supplement: 'Integratore',
  recovery: 'Recupero',
  skincare: 'Skincare',
  movement: 'Movimento',
};

export default function ProtocolScreen({
  activities,
  completedBySlot,
  initialSlot,
  onToggle,
}: {
  activities: RoutineProgressRow[];
  completedBySlot: Record<string, number>;
  initialSlot: Slot;
  onToggle: (activityId: string, slot: Slot) => void;
}) {
  const { dark } = useDarkMode();
  const [slot, setSlot] = useState<Slot>(initialSlot);
  const [openWhy, setOpenWhy] = useState<string | null>(null);

  const slotActivities = activities.filter((a) => a.slot === slot);
  const pct = completedBySlot[slot] ?? 0;
  const meta = slotMeta[slot];

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in-up">
      <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Protocollo giornaliero</h1>
      <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Tocca un task per segnarlo completato.</p>

      {/* Slot selector */}
      <div className="flex gap-2 mb-5 no-scrollbar overflow-x-auto">
        {(['morning', 'afternoon', 'evening'] as Slot[]).map((s) => {
          const m = slotMeta[s];
          const active = slot === s;
          return (
            <button
              key={s}
              onClick={() => setSlot(s)}
              className={`flex-1 min-w-[100px] p-3 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 ${
                active
                  ? `bg-gradient-to-br ${m.bg} text-white shadow-lg`
                  : dark ? 'bg-night-800 text-night-300' : 'bg-white border border-night-100 text-night-600'
              }`}
            >
              <m.icon className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-bold">{m.label}</p>
                <p className={`text-[10px] ${active ? 'text-white/80' : dark ? 'text-night-500' : 'text-night-400'}`}>{m.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Slot progress */}
      <Card className={`p-4 mb-4 ${slot === 'morning' ? 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 border-amber-200 dark:border-amber-800/30' : slot === 'afternoon' ? 'bg-gradient-to-br from-sage-50 to-emerald-50 dark:from-sage-900/20 dark:to-emerald-900/10 border-sage-200 dark:border-sage-800/30' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800/30'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProgressRing value={pct} size={56} stroke={6} color={meta.ring}>
              <meta.icon className={`w-5 h-5 ${meta.color}`} />
            </ProgressRing>
            <div>
              <p className={`font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{meta.label}</p>
              <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{slotActivities.filter((a) => a.completed).length} di {slotActivities.length} completati</p>
            </div>
          </div>
          <span className={`text-2xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{pct}%</span>
        </div>
      </Card>

      {/* Tasks */}
      {slotActivities.length === 0 ? (
        <EmptyState
          icon={<meta.icon className="w-7 h-7 text-night-400" />}
          title={`Nessun task per ${meta.label.toLowerCase()}`}
          subtitle="Il tuo protocollo non ha attività in questa fascia. Completa le altre fasce."
        />
      ) : (
        <div className="space-y-2.5">
          {slotActivities.map((a) => {
            const isOpen = openWhy === a.id;
            return (
              <div
                key={a.id}
                className={`rounded-2xl border transition-all ${
                  a.completed
                    ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800/40'
                    : dark ? 'bg-night-800 border-night-700' : 'bg-white border-night-100'
                }`}
              >
                <button
                  onClick={() => onToggle(a.activity_id, a.slot)}
                  className="w-full p-4 flex items-center gap-3 active:scale-[0.99] transition-transform text-left"
                >
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      a.completed ? 'bg-sage-500 border-sage-500 scale-110' : dark ? 'border-night-600' : 'border-night-300'
                    }`}
                  >
                    {a.completed && <Check className="w-4 h-4 text-white animate-pop" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${a.completed ? 'text-sage-700 dark:text-sage-400 line-through' : dark ? 'text-white' : 'text-night-900'}`}>
                      {a.activity_name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {a.duration && (
                        <span className={`text-xs flex items-center gap-1 ${dark ? 'text-night-400' : 'text-night-500'}`}>
                          <Clock className="w-3 h-3" />{a.duration}
                        </span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${dark ? 'bg-night-700 text-night-300' : 'bg-night-100 text-night-500'}`}>
                        {categoryLabel[a.category]}
                      </span>
                    </div>
                  </div>
                  {a.completed && (
                    <span className="px-2 py-1 rounded-full bg-sage-500/20 text-sage-600 dark:text-sage-400 text-xs font-bold animate-pop">
                      +{a.xp}
                    </span>
                  )}
                </button>
                {/* Why toggle */}
                <button
                  onClick={() => setOpenWhy(isOpen ? null : a.id)}
                  className={`w-full px-4 pb-3 flex items-center gap-1.5 text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Perché te lo consigliamo</span>
                  <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className={`px-4 pb-4 -mt-1 animate-fade-in-up`}>
                    <div className={`p-3 rounded-xl text-xs leading-relaxed ${dark ? 'bg-night-700 text-night-200' : 'bg-night-50 text-night-600'}`}>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-sage-500 mt-0.5 flex-shrink-0" />
                        <span>{whyText(a)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function whyText(a: RoutineProgressRow): string {
  const map: Record<string, string> = {
    'un-sunlight': 'Sincronizza il ritmo circadiano e migliora il sonno della notte successiva.',
    'un-hydrate': "Ripristina l'idratazione dopo 7-9 ore senza liquidi.",
    'un-protein': 'Stabilizza glicemia e caffeina, riduce fame serale.',
    'un-winddown': 'Segnale coerente al cervello che inizia il sonno.',
    'un-screens-off': 'La luce blu ritarda la melatonina di 90+ minuti.',
    'un-cool-room': 'La temperatura fresca segnala al corpo che è notte.',
  };
  return map[a.activity_id] ?? `Abitudine chiave del protocollo ${categoryLabel[a.category].toLowerCase()}. Completala per accumulare XP e streak.`;
}
