import { Home, Package, Crown } from 'lucide-react';
import type { NavTab } from './NavTypes';

interface Props {
  navTab: NavTab;
  setNavTab: (t: NavTab) => void;
  isDarkMode: boolean;
  isPremium: boolean;
}

export default function BottomNav({ navTab, setNavTab, isDarkMode, isPremium }: Props) {
  const items: { id: NavTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Routine', icon: Home },
    { id: 'products', label: 'Prodotti', icon: Package },
    { id: 'pro', label: 'Pro', icon: Crown },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 safe-bottom ${isDarkMode ? 'bg-night-800/95 border-night-700' : 'bg-white/95 border-night-200'} backdrop-blur-lg border-t`}>
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const active = navTab === id;
          const isProLocked = id === 'pro' && !isPremium;
          return (
            <button key={id} onClick={() => setNavTab(id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
                active ? (isDarkMode ? 'bg-sage-900/40' : 'bg-sage-50') : ''
              }`}>
              <Icon className={`w-5 h-5 ${active ? 'text-sage-500' : isDarkMode ? 'text-night-500' : 'text-night-400'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-sage-500' : isDarkMode ? 'text-night-500' : 'text-night-400'}`}>
                {isProLocked ? 'Pro' : label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
