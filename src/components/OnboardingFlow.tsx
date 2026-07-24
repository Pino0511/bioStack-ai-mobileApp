import { Sparkles, ArrowLeft, ArrowRight, Loader2, User, Target, Droplets, Wallet } from 'lucide-react';

type Goal = 'skincare' | 'posture' | 'focus';
type SkinType = 'dry' | 'oily' | 'combination';
type Budget = 'low' | 'medium' | 'elite';

interface Props {
  step: number;
  setStep: (s: number) => void;
  name: string;
  setName: (v: string) => void;
  age: number;
  setAge: (v: number) => void;
  goal: Goal | null;
  setGoal: (g: Goal | null) => void;
  skinType: SkinType | null;
  setSkinType: (s: SkinType | null) => void;
  budget: Budget | null;
  setBudget: (b: Budget | null) => void;
  onComplete: () => void;
  loading: boolean;
  email: string | null;
}

export default function OnboardingFlow({
  step, setStep, name, setName, age, setAge,
  goal, setGoal, skinType, setSkinType, budget, setBudget,
  onComplete, loading, email,
}: Props) {
  const goals: { id: Goal; label: string; desc: string; icon: typeof Target }[] = [
    { id: 'skincare', label: 'Skincare & Glow Up', desc: 'Pelle luminosa e lineamenti definiti', icon: Sparkles },
    { id: 'posture', label: 'Postura & Fisico', desc: 'Allinea corpo e mascella', icon: Target },
    { id: 'focus', label: 'Focus & Longevità', desc: 'Mente acuta e vitalità', icon: Droplets },
  ];
  const skins: { id: SkinType; label: string }[] = [
    { id: 'dry', label: 'Secca' }, { id: 'oily', label: 'Grassa' }, { id: 'combination', label: 'Mista' },
  ];
  const budgets: { id: Budget; label: string; desc: string }[] = [
    { id: 'low', label: 'Essenziale', desc: 'Under 30€/mese' },
    { id: 'medium', label: 'Bilanciato', desc: '30-80€/mese' },
    { id: 'elite', label: 'Premium', desc: '80€+/mese' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-emerald-50 to-teal-50 flex flex-col p-6">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-night-900">BioStack AI</span>
          </div>
          <span className="text-sm text-night-400">{step}/3</span>
        </div>

        <div className="flex gap-1.5 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1.5 rounded-full flex-1 transition-all ${s <= step ? 'bg-sage-500' : 'bg-night-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div>
              <h1 className="text-2xl font-bold text-night-900">Benvenuto!</h1>
              <p className="text-sm text-night-500 mt-1">Personalizziamo il tuo protocollo.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-night-600 mb-1.5 block">Come ti chiami?</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Il tuo nome"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-night-200 text-night-900 placeholder-night-300 focus:outline-none focus:ring-2 focus:ring-sage-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-night-600 mb-1.5 block">Età: <span className="text-sage-600 font-bold">{age}</span></label>
              <input type="range" min="16" max="80" value={age} onChange={e => setAge(Number(e.target.value))}
                className="w-full accent-sage-500" />
            </div>
            <button onClick={() => setStep(2)} disabled={!name}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]">
              Continua <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div>
              <h1 className="text-2xl font-bold text-night-900">Il tuo obiettivo</h1>
              <p className="text-sm text-night-500 mt-1">Scegli l'area su cui concentrarti.</p>
            </div>
            <div className="space-y-3">
              {goals.map(({ id, label, desc, icon: Icon }) => (
                <button key={id} onClick={() => setGoal(id)}
                  className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all border-2 ${
                    goal === id ? 'bg-sage-50 border-sage-500' : 'bg-white border-transparent'
                  }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${goal === id ? 'bg-sage-500' : 'bg-night-100'}`}>
                    <Icon className={`w-6 h-6 ${goal === id ? 'text-white' : 'text-night-400'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-night-900">{label}</p>
                    <p className="text-xs text-night-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-medium text-night-600 mb-2 block">Tipo di pelle</label>
              <div className="grid grid-cols-3 gap-2">
                {skins.map(({ id, label }) => (
                  <button key={id} onClick={() => setSkinType(id)}
                    className={`py-3 rounded-2xl text-sm font-medium transition-all border-2 ${
                      skinType === id ? 'bg-sage-500 text-white border-sage-500' : 'bg-white text-night-600 border-transparent'
                    }`}>{label}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-4 rounded-2xl bg-night-100 text-night-600 font-medium flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setStep(3)} disabled={!goal || !skinType}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]">
                Continua <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in flex-1">
            <div>
              <h1 className="text-2xl font-bold text-night-900">Il tuo budget</h1>
              <p className="text-sm text-night-500 mt-1">Adatteremo i prodotti consigliati.</p>
            </div>
            <div className="space-y-3">
              {budgets.map(({ id, label, desc }) => (
                <button key={id} onClick={() => setBudget(id)}
                  className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all border-2 ${
                    budget === id ? 'bg-sage-50 border-sage-500' : 'bg-white border-transparent'
                  }`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${budget === id ? 'bg-sage-500' : 'bg-night-100'}`}>
                    <Wallet className={`w-6 h-6 ${budget === id ? 'text-white' : 'text-night-400'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-night-900">{label}</p>
                    <p className="text-xs text-night-500">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-4 rounded-2xl bg-night-100 text-night-600 font-medium">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button onClick={onComplete} disabled={!budget || loading}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Salvataggio...</> : <>Inizia <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </div>
        )}

        {email && <p className="text-center text-xs text-night-400 mt-4">Connesso come {email}</p>}
      </div>
    </div>
  );
}
