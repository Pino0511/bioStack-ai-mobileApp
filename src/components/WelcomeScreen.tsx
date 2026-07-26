import { Sparkles, Shield, Clock, Zap, ArrowRight } from 'lucide-react';
import { useDarkMode } from './darkMode';

export default function WelcomeScreen({ onStart, onDemo }: { onStart: () => void; onDemo: () => void }) {
  const { dark } = useDarkMode();
  return (
    <div className={`min-h-screen flex flex-col px-6 safe-top safe-bottom ${dark ? 'bg-night-900' : 'bg-gradient-to-b from-sage-50 via-night-50 to-white'}`}>
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-sage-500/30">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className={`text-[2.5rem] leading-[1.1] font-bold mb-3 ${dark ? 'text-white' : 'text-night-900'}`}>
            Il tuo protocollo<br />di glow up.
          </h1>
          <p className={`text-base mb-8 ${dark ? 'text-night-400' : 'text-night-600'}`}>
            Skincare, postura, focus e longevità — un piano personalizzato che segui in 10 minuti al giorno.
          </p>
        </div>

        <div className="space-y-3 mb-8 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {[
            { icon: Zap, text: 'Basato su evidence-based wellness' },
            { icon: Clock, text: '10 minuti al giorno. Protocollo reale, non teoria.' },
            { icon: Shield, text: 'Privacy totale — nessuna foto condivisa' },
          ].map((f, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3.5 rounded-2xl ${dark ? 'bg-night-800' : 'bg-white border border-night-100'}`}
            >
              <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-4.5 h-4.5 text-sage-600 dark:text-sage-400" />
              </div>
              <span className={`text-sm font-medium ${dark ? 'text-night-200' : 'text-night-700'}`}>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 text-white font-semibold text-base flex items-center justify-center gap-2 shadow-lg shadow-sage-500/30 active:scale-[0.98] transition-transform"
          >
            Crea il mio protocollo
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={onDemo}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] ${
              dark ? 'bg-night-800 text-night-200' : 'bg-white text-night-700 border border-night-200'
            }`}
          >
            Esplora la demo
          </button>
        </div>
      </div>
    </div>
  );
}
