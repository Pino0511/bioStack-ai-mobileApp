import { useEffect, useState } from 'react';
import { Sparkles, Target, ArrowRight, Sun, CloudSun, Moon, Check } from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Button, Card, ProgressRing } from './ui';
import { generateProtocol, GOAL_LABELS } from '../lib/protocol';
import type { OnboardingAnswers, Slot } from '../lib/types';

const slotMeta: Record<Slot, { icon: typeof Sun; label: string; color: string }> = {
  morning: { icon: Sun, label: 'Mattina', color: 'text-amber-500' },
  afternoon: { icon: CloudSun, label: 'Pomeriggio', color: 'text-sage-500' },
  evening: { icon: Moon, label: 'Sera', color: 'text-indigo-400' },
};

export default function ResultScreen({
  answers,
  onEnter,
}: {
  answers: OnboardingAnswers;
  onEnter: () => void;
}) {
  const { dark } = useDarkMode();
  const [animatedScore, setAnimatedScore] = useState(0);
  const protocol = generateProtocol(answers);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.round(eased * protocol.score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [protocol.score]);

  const slots: Slot[] = ['morning', 'afternoon', 'evening'];

  return (
    <div className={`min-h-screen px-6 pt-6 pb-8 safe-top safe-bottom ${dark ? 'bg-night-900' : 'bg-gradient-to-b from-sage-50 to-night-50'}`}>
      <div className="max-w-sm mx-auto w-full animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Protocollo generato
          </div>
          <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>
            Il tuo protocollo è pronto
          </h1>
          <p className={`text-sm ${dark ? 'text-night-400' : 'text-night-500'}`}>
            {GOAL_LABELS[answers.goal]} · personalizzato su {answers.secondaryGoals.length + 1} obiettivi
          </p>
        </div>

        {/* Score */}
        <Card className="p-6 mb-5 text-center">
          <ProgressRing value={animatedScore} size={140} stroke={12}>
            <div>
              <p className={`text-4xl font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{animatedScore}</p>
              <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>Protocol Score</p>
            </div>
          </ProgressRing>
          <p className={`text-sm mt-4 ${dark ? 'text-night-300' : 'text-night-600'}`}>
            Più alto = maggiore potenziale di miglioramento. Ora trasformiamolo in risultati.
          </p>
        </Card>

        {/* Priorities */}
        <div className="mb-5">
          <h2 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${dark ? 'text-night-400' : 'text-night-500'}`}>
            Le 3 priorità
          </h2>
          <div className="space-y-2.5">
            {protocol.priorities.map((p, i) => (
              <Card key={i} className="p-4 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-sage-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <p className={`font-semibold text-sm mb-0.5 ${dark ? 'text-white' : 'text-night-900'}`}>{p.title}</p>
                  <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{p.detail}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily preview */}
        <div className="mb-6">
          <h2 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${dark ? 'text-night-400' : 'text-night-500'}`}>
            Anteprima protocollo giornaliero
          </h2>
          <div className="space-y-3">
            {slots.map((slot) => {
              const items = protocol.activities.filter((a) => a.slot === slot);
              if (items.length === 0) return null;
              const meta = slotMeta[slot];
              return (
                <Card key={slot} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <meta.icon className={`w-4.5 h-4.5 ${meta.color}`} />
                    <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>{meta.label}</span>
                    <span className={`text-xs ml-auto ${dark ? 'text-night-500' : 'text-night-400'}`}>{items.length} task</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.slice(0, 4).map((it) => (
                      <div key={it.id} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${dark ? 'border-night-600' : 'border-night-300'}`} />
                        <span className={`text-xs ${dark ? 'text-night-300' : 'text-night-600'}`}>{it.name}</span>
                      </div>
                    ))}
                    {items.length > 4 && (
                      <p className={`text-xs pl-6 ${dark ? 'text-night-500' : 'text-night-400'}`}>+{items.length - 4} altri</p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stack preview */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4.5 h-4.5 text-sage-500" />
            <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>Stack consigliato</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {protocol.stack.slice(0, 4).map((s) => (
              <span key={s.id} className="px-2.5 py-1 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 text-xs font-medium">
                {s.name}
              </span>
            ))}
          </div>
        </Card>

        <Button onClick={onEnter}>
          Inizia il protocollo di oggi <ArrowRight className="w-5 h-5" />
        </Button>
        <p className={`text-center text-xs mt-3 ${dark ? 'text-night-500' : 'text-night-400'}`}>
          <Check className="w-3 h-3 inline mr-1" />
          Puoi modificare i tuoi obiettivi in qualsiasi momento
        </p>
      </div>
    </div>
  );
}
