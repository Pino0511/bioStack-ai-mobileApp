import {
  Crown, Sparkles, CheckCircle2, Loader2, Clock, Zap, Flame,
  TrendingUp, Lock, Target,
} from 'lucide-react';
import type { GlowUpData } from '../types';
import { formatCountdown } from '../types';

type SubscriptionPlan = 'annual' | 'monthly';

interface Props {
  isDarkMode: boolean;
  isPremium: boolean;
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (p: SubscriptionPlan) => void;
  onPayment: () => void;
  isProcessingPayment: boolean;
  countdown: number;
  glowUpHistory: GlowUpData[];
  totalCompleted: number;
  xpPoints: number;
  streak: number;
}

export default function ProView({
  isDarkMode, isPremium, subscriptionPlan, setSubscriptionPlan,
  onPayment, isProcessingPayment, countdown, glowUpHistory,
  totalCompleted, xpPoints, streak,
}: Props) {
  const cardClass = isDarkMode ? 'bg-night-800 border-night-700' : 'bg-white border-night-100';

  if (isPremium) {
    return (
      <div className="px-5 pt-6 pb-6 space-y-5">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>BioStack Pro</h1>
          <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Sei un membro Premium</p>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Zap className="w-5 h-5" />} value={xpPoints} label="XP" isDarkMode={isDarkMode} color="sage" />
          <StatCard icon={<Flame className="w-5 h-5" />} value={streak} label="Streak" isDarkMode={isDarkMode} color="amber" />
          <StatCard icon={<CheckCircle2 className="w-5 h-5" />} value={totalCompleted} label="Attività" isDarkMode={isDarkMode} color="emerald" />
        </div>

        {/* Glow up chart */}
        <div className={`p-5 rounded-2xl border ${cardClass}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} />
            <h2 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Andamento Glow Up</h2>
          </div>
          {glowUpHistory.length > 0 ? (
            <GlowChart data={glowUpHistory} isDarkMode={isDarkMode} />
          ) : (
            <div className={`text-center py-8 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`}>
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nessun dato ancora. Completa analisi nel Diario.</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className={`p-5 rounded-2xl border ${cardClass}`}>
          <h2 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Funzioni Pro attive</h2>
          <div className="space-y-3">
            {[
              'Report biometrico completo',
              'Raccomandazioni capelli & barba',
              'Stile occhiali personalizzato',
              'Analisi comparativa prima/dopo',
              'Grafico andamento Glow Up',
              'Prodotti illimitati',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-sage-500 flex-shrink-0" />
                <span className={`text-sm ${isDarkMode ? 'text-night-200' : 'text-night-700'}`}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6 space-y-5">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>BioStack Pro</h1>
        <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Sblocca il pieno potenziale</p>
      </div>

      {/* Countdown */}
      <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-night-800' : 'bg-amber-50'}`}>
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clock className={`w-4 h-4 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
          <span className={`text-xs font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>Offerta limitata</span>
        </div>
        <p className={`text-2xl font-bold tabular-nums ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{formatCountdown(countdown)}</p>
      </div>

      {/* Features preview */}
      <div className={`p-5 rounded-2xl border ${cardClass}`}>
        <div className="space-y-3">
          {[
            'Report biometrico completo',
            'Raccomandazioni capelli & barba',
            'Stile occhiali personalizzato',
            'Analisi comparativa prima/dopo',
            'Grafico andamento Glow Up',
            'Prodotti illimitati',
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-night-700' : 'bg-night-100'}`}>
                <Lock className={`w-3 h-3 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`} />
              </div>
              <span className={`text-sm ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-3">
        <button onClick={() => setSubscriptionPlan('annual')}
          className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
            subscriptionPlan === 'annual' ? (isDarkMode ? 'bg-sage-900/30 border-sage-500' : 'bg-sage-50 border-sage-500') : (isDarkMode ? 'bg-night-800 border-transparent' : 'bg-white border-transparent')
          }`}>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Annuale</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">RISPARMIA 50%</span>
            </div>
            {subscriptionPlan === 'annual' && <CheckCircle2 className="w-5 h-5 text-sage-500" />}
          </div>
          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>59,99€/anno</p>
          <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Solo 5€/mese</p>
        </button>
        <button onClick={() => setSubscriptionPlan('monthly')}
          className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
            subscriptionPlan === 'monthly' ? (isDarkMode ? 'bg-sage-900/30 border-sage-500' : 'bg-sage-50 border-sage-500') : (isDarkMode ? 'bg-night-800 border-transparent' : 'bg-white border-transparent')
          }`}>
          <div className="flex justify-between items-center mb-1">
            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Mensile</span>
            {subscriptionPlan === 'monthly' && <CheckCircle2 className="w-5 h-5 text-sage-500" />}
          </div>
          <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>9,99€/mese</p>
        </button>
      </div>

      <button onClick={onPayment} disabled={isProcessingPayment}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70">
        {isProcessingPayment ? <><Loader2 className="w-5 h-5 animate-spin" /> Elaborazione...</> : <><Crown className="w-5 h-5" /> Sblocca Pro</>}
      </button>
    </div>
  );
}

function StatCard({ icon, value, label, isDarkMode, color }: {
  icon: React.ReactNode; value: number; label: string; isDarkMode: boolean; color: 'sage' | 'amber' | 'emerald';
}) {
  const colors = {
    sage: 'text-sage-500', amber: 'text-amber-500', emerald: 'text-emerald-500',
  };
  return (
    <div className={`p-4 rounded-2xl text-center ${isDarkMode ? 'bg-night-800' : 'bg-white border border-night-100'}`}>
      <div className={`flex justify-center mb-1 ${colors[color]}`}>{icon}</div>
      <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{value}</p>
      <p className={`text-[10px] ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{label}</p>
    </div>
  );
}

function GlowChart({ data, isDarkMode }: { data: GlowUpData[]; isDarkMode: boolean }) {
  const maxScore = Math.max(...data.map(d => d.score), 100);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = 100 - (d.score / maxScore) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative h-40 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline points={points} className="chart-line" />
        {data.map((d, i) => {
          const x = (i / (data.length - 1 || 1)) * 100;
          const y = 100 - (d.score / maxScore) * 100;
          return <circle key={i} cx={x} cy={y} r="1.5" className="chart-dot" />;
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-night-400">
        {data.map((d, i) => <span key={i}>Sett {d.week}</span>)}
      </div>
    </div>
  );
}
