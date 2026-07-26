import { useState } from 'react';
import {
  Droplets, Target, Brain, Heart, Zap, Scale, ChevronLeft, Check, Sparkles,
  Sun, Moon, Battery, Activity, ArrowRight,
} from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Button } from './ui';
import type { OnboardingAnswers, GoalId, Sex, SkinType } from '../lib/types';

const TOTAL_STEPS = 6;

const GOALS: { id: GoalId; label: string; desc: string; icon: typeof Droplets }[] = [
  { id: 'skincare', label: 'Skincare & Glow', desc: 'Pelle, anti-aging, radiance', icon: Droplets },
  { id: 'posture', label: 'Postura & Mewing', desc: 'Mascella, collo, postura', icon: Target },
  { id: 'focus', label: 'Focus & Performance', desc: 'Energia mentale, deep work', icon: Brain },
  { id: 'longevity', label: 'Longevità', desc: 'Salute cellulare, abitudini', icon: Heart },
  { id: 'energy', label: 'Energia & Vitalità', desc: 'Combattere stanchezza', icon: Zap },
  { id: 'body', label: 'Composizione Corporea', desc: 'Massa magra, grasso', icon: Scale },
];

export default function OnboardingScreen({
  onComplete,
  onBack,
  initial,
}: {
  onComplete: (a: OnboardingAnswers) => void;
  onBack: () => void;
  initial: Partial<OnboardingAnswers>;
}) {
  const { dark } = useDarkMode();
  const [step, setStep] = useState(1);
  const [a, setA] = useState<OnboardingAnswers>({
    goal: initial.goal ?? 'skincare',
    secondaryGoals: initial.secondaryGoals ?? [],
    age: initial.age ?? 25,
    sex: initial.sex,
    energyLevel: initial.energyLevel ?? 3,
    sleepQuality: initial.sleepQuality ?? 3,
    stressLevel: initial.stressLevel ?? 3,
    workoutFrequency: initial.workoutFrequency ?? 2,
    skinType: initial.skinType,
    limitations: [],
  });

  const update = <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const canProceed = () => {
    if (step === 1) return !!a.goal;
    return true; // other steps have defaults
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else onComplete(a);
  };

  const cardSel = (selected: boolean) =>
    `w-full p-4 rounded-2xl flex items-center gap-3 transition-all active:scale-[0.98] border-2 ${
      selected
        ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-500'
        : dark
          ? 'bg-night-800 border-night-700'
          : 'bg-white border-night-100'
    }`;

  const pillSel = (selected: boolean) =>
    `flex-1 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
      selected ? 'bg-sage-500 text-white' : dark ? 'bg-night-800 text-night-300' : 'bg-white text-night-600 border border-night-100'
    }`;

  return (
    <div className={`min-h-screen flex flex-col px-6 safe-top safe-bottom ${dark ? 'bg-night-900' : 'bg-night-50'}`}>
      {/* Progress bar */}
      <div className="pt-4 max-w-sm mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          {step > 1 && (
            <button
              onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
              className={`w-9 h-9 rounded-full flex items-center justify-center ${dark ? 'bg-night-800' : 'bg-white border border-night-100'}`}
            >
              <ChevronLeft className="w-5 h-5 text-night-500" />
            </button>
          )}
          <div className="flex-1 h-2 rounded-full bg-night-200 dark:bg-night-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${dark ? 'text-night-400' : 'text-night-500'}`}>{step}/{TOTAL_STEPS}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full animate-fade-in-up" key={step}>
        {/* STEP 1 — Goal */}
        {step === 1 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Qual è il tuo obiettivo?</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Scegline uno principale. Puoi aggiungerne altri dopo.</p>
            <div className="space-y-2.5">
              {GOALS.map((g) => (
                <button key={g.id} onClick={() => update('goal', g.id)} className={cardSel(a.goal === g.id)}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${a.goal === g.id ? 'bg-sage-500 text-white' : dark ? 'bg-night-700 text-night-400' : 'bg-night-100 text-night-500'}`}>
                    <g.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-semibold ${dark ? 'text-white' : 'text-night-900'}`}>{g.label}</p>
                    <p className={`text-xs ${dark ? 'text-night-400' : 'text-night-500'}`}>{g.desc}</p>
                  </div>
                  {a.goal === g.id && <Check className="w-5 h-5 text-sage-500" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Age + Sex */}
        {step === 2 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Qualcosa su di te</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Serve a calibrare il protocollo. Tutto opzionale.</p>
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium mb-2 block ${dark ? 'text-night-300' : 'text-night-700'}`}>Età</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={14} max={80} value={a.age}
                    onChange={(e) => update('age', parseInt(e.target.value))}
                    className="flex-1 accent-sage-500"
                  />
                  <span className={`w-14 text-center font-bold text-lg ${dark ? 'text-white' : 'text-night-900'}`}>{a.age}</span>
                </div>
              </div>
              <div>
                <label className={`text-sm font-medium mb-2 block ${dark ? 'text-night-300' : 'text-night-700'}`}>Sesso (opzionale)</label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as Sex[]).map((s) => (
                    <button key={s} onClick={() => update('sex', s)} className={pillSel(a.sex === s)}>
                      {s === 'male' ? 'Uomo' : s === 'female' ? 'Donna' : 'Altro'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Energy + Sleep */}
        {step === 3 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Energia & sonno</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Su una scala 1-5, dove stai adesso?</p>
            <div className="space-y-5">
              <ScaleRow icon={Battery} label="Livello di energia" value={a.energyLevel} onChange={(v) => update('energyLevel', v)} dark={dark} low="Bassa" high="Allegra" />
              <ScaleRow icon={Moon} label="Qualità del sonno" value={a.sleepQuality} onChange={(v) => update('sleepQuality', v)} dark={dark} low="Pessima" high="Ottima" />
            </div>
          </div>
        )}

        {/* STEP 4 — Stress + Workout */}
        {step === 4 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Stress & movimento</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Quanto ti alleni e quanto sei sotto pressione?</p>
            <div className="space-y-5">
              <ScaleRow icon={Activity} label="Stress percepito" value={a.stressLevel} onChange={(v) => update('stressLevel', v)} dark={dark} low="Tranquillo" high="Teso" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
                    <Sun className="w-4.5 h-4.5 text-sage-600 dark:text-sage-400" />
                  </div>
                  <span className={`text-sm font-medium ${dark ? 'text-night-300' : 'text-night-700'}`}>Allenamenti a settimana</span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      onClick={() => update('workoutFrequency', d)}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-90 ${
                        a.workoutFrequency === d ? 'bg-sage-500 text-white' : dark ? 'bg-night-800 text-night-400' : 'bg-white text-night-500 border border-night-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Skin type (skippable) */}
        {step === 5 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Tipo di pelle?</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Solo se skincare è nei tuoi obiettivi. Salta se non ti interessa.</p>
            <div className="grid grid-cols-2 gap-3">
              {(['dry', 'oily', 'combination', 'normal'] as SkinType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => update('skinType', s)}
                  className={`p-5 rounded-2xl text-center transition-all active:scale-95 border-2 ${
                    a.skinType === s
                      ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-500'
                      : dark ? 'bg-night-800 border-night-700' : 'bg-white border-night-100'
                  }`}
                >
                  <span className={`font-semibold ${dark ? 'text-white' : 'text-night-900'}`}>
                    {s === 'dry' ? 'Secca' : s === 'oily' ? 'Grassa' : s === 'combination' ? 'Mista' : 'Normale'}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => update('skinType', undefined)} className={`mt-4 text-sm font-medium ${dark ? 'text-night-400' : 'text-night-500'}`}>
              Salta questo passo
            </button>
          </div>
        )}

        {/* STEP 6 — Secondary goals */}
        {step === 6 && (
          <div className="flex flex-col h-full">
            <h2 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Altri obiettivi?</h2>
            <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Seleziona quanti vuoi. Il protocollo li includerà tutti.</p>
            <div className="space-y-2.5">
              {GOALS.filter((g) => g.id !== a.goal).map((g) => {
                const sel = a.secondaryGoals.includes(g.id);
                return (
                  <button
                    key={g.id}
                    onClick={() =>
                      update(
                        'secondaryGoals',
                        sel ? a.secondaryGoals.filter((x) => x !== g.id) : [...a.secondaryGoals, g.id]
                      )
                    }
                    className={cardSel(sel)}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${sel ? 'bg-sage-500 text-white' : dark ? 'bg-night-700 text-night-400' : 'bg-night-100 text-night-500'}`}>
                      <g.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-semibold ${dark ? 'text-white' : 'text-night-900'}`}>{g.label}</p>
                    </div>
                    {sel && <Check className="w-5 h-5 text-sage-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-6 pb-6 mt-auto">
          <Button onClick={next} disabled={!canProceed()}>
            {step === TOTAL_STEPS ? (
              <>
                <Sparkles className="w-5 h-5" /> Genera il mio protocollo
              </>
            ) : (
              <>
                Continua <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScaleRow({
  icon: Icon, label, value, onChange, dark, low, high,
}: {
  icon: typeof Battery;
  label: string;
  value: number;
  onChange: (v: number) => void;
  dark: boolean;
  low: string;
  high: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-sage-600 dark:text-sage-400" />
        </div>
        <span className={`text-sm font-medium ${dark ? 'text-night-300' : 'text-night-700'}`}>{label}</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-90 ${
              value === n ? 'bg-sage-500 text-white' : dark ? 'bg-night-800 text-night-400' : 'bg-white text-night-500 border border-night-100'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className={`text-xs ${dark ? 'text-night-500' : 'text-night-400'}`}>{low}</span>
        <span className={`text-xs ${dark ? 'text-night-500' : 'text-night-400'}`}>{high}</span>
      </div>
    </div>
  );
}
