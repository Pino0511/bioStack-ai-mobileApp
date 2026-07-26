import { Home, CalendarCheck, BarChart3, Pill, User } from 'lucide-react';
import { useDarkMode } from './darkMode';

export type AppTab = 'home' | 'protocol' | 'insights' | 'stack' | 'profile';

const tabs: { id: AppTab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'protocol', label: 'Protocollo', icon: CalendarCheck },
  { id: 'insights', label: 'Insight', icon: BarChart3 },
  { id: 'stack', label: 'Stack', icon: Pill },
  { id: 'profile', label: 'Profilo', icon: User },
];

export default function BottomNav({ active, onChange }: { active: AppTab; onChange: (t: AppTab) => void }) {
  const { dark } = useDarkMode();
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 border-t safe-bottom ${
        dark ? 'bg-night-800/95 border-night-700 backdrop-blur-md' : 'bg-white/95 border-night-100 backdrop-blur-md'
      }`}
    >
      <div className="max-w-[480px] mx-auto flex">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex-1 py-2.5 flex flex-col items-center gap-0.5 transition-all"
            >
              <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-sage-500/10' : ''}`}>
                <t.icon
                  className={`w-5 h-5 transition-colors ${isActive ? 'text-sage-600 dark:text-sage-400' : dark ? 'text-night-500' : 'text-night-400'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-sage-600 dark:text-sage-400' : dark ? 'text-night-500' : 'text-night-400'
                }`}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
