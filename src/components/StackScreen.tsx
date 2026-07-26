import { useMemo, useState } from 'react';
import { Pill, Apple, Activity, Moon, Shield, Info, Stethoscope, Clock } from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Card, Chip, EmptyState } from './ui';
import { generateProtocol } from '../lib/protocol';
import type { OnboardingAnswers, ProtocolStackItem } from '../lib/types';

type Filter = 'all' | 'habit' | 'nutrition' | 'supplement' | 'recovery';

const typeMeta: Record<ProtocolStackItem['type'], { icon: typeof Pill; label: string; tone: string }> = {
  habit: { icon: Activity, label: 'Abitudine', tone: 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400' },
  nutrition: { icon: Apple, label: 'Nutrizione', tone: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  supplement: { icon: Pill, label: 'Integratore', tone: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  recovery: { icon: Moon, label: 'Recupero', tone: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
};

export default function StackScreen({ answers }: { answers: OnboardingAnswers | null }) {
  const { dark } = useDarkMode();
  const [filter, setFilter] = useState<Filter>('all');

  const stack = useMemo(() => (answers ? generateProtocol(answers).stack : []), [answers]);
  const filtered = filter === 'all' ? stack : stack.filter((s) => s.type === filter);

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in-up">
      <h1 className={`text-2xl font-bold mb-1 ${dark ? 'text-white' : 'text-night-900'}`}>Il tuo stack</h1>
      <p className={`text-sm mb-5 ${dark ? 'text-night-400' : 'text-night-500'}`}>Abitudini, nutrizione, integratori e recupero</p>

      {/* Disclaimer banner */}
      <div className={`flex items-start gap-2.5 p-3.5 rounded-2xl mb-4 text-xs leading-relaxed ${dark ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Informazioni educative, non consigli medici. Consulta un professionista prima di iniziare integratori, soprattutto se prendi farmaci.</span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 no-scrollbar overflow-x-auto">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Tutti</Chip>
        <Chip active={filter === 'habit'} onClick={() => setFilter('habit')}>Abitudini</Chip>
        <Chip active={filter === 'nutrition'} onClick={() => setFilter('nutrition')}>Nutrizione</Chip>
        <Chip active={filter === 'supplement'} onClick={() => setFilter('supplement')}>Integratori</Chip>
        <Chip active={filter === 'recovery'} onClick={() => setFilter('recovery')}>Recupero</Chip>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Pill className="w-7 h-7 text-night-400" />}
          title="Nessun elemento"
          subtitle="Completa l'onboarding per vedere il tuo stack personalizzato."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const meta = typeMeta[item.type];
            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${meta.tone}`}>
                    <meta.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>{item.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${meta.tone}`}>{meta.label}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-3 rounded-xl mb-2.5 ${dark ? 'bg-night-700' : 'bg-night-50'}`}>
                  <Clock className="w-4 h-4 text-sage-500 flex-shrink-0" />
                  <span className={`text-xs ${dark ? 'text-night-200' : 'text-night-700'}`}>{item.timing}</span>
                </div>

                <p className={`text-xs leading-relaxed mb-3 ${dark ? 'text-night-300' : 'text-night-600'}`}>{item.note}</p>

                {item.safety && (
                  <div className={`flex items-start gap-2 p-3 rounded-xl text-xs leading-relaxed ${dark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'}`}>
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{item.safety}</span>
                  </div>
                )}

                {item.consultPro && (
                  <div className={`flex items-center gap-1.5 mt-2.5 text-xs font-medium ${dark ? 'text-night-400' : 'text-night-500'}`}>
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Parlane con un professionista</span>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
