import { Sun, Moon, Flame, ChevronRight } from 'lucide-react';
import type { LevelInfo } from '../types';

interface Props {
  isDarkMode: boolean;
  levelInfo: LevelInfo;
  streak: number;
  onOpenDrawer: () => void;
  toggleDarkMode: () => void;
}

export default function AppHeader({ isDarkMode, levelInfo, streak, onOpenDrawer, toggleDarkMode }: Props) {
  return (
    <header className={`sticky top-0 z-30 safe-top ${isDarkMode ? 'bg-night-900/95 border-night-800' : 'bg-white/95 border-night-100'} backdrop-blur-lg border-b`}>
      <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
        <button onClick={onOpenDrawer} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div className="text-left">
            <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>BioStack AI</p>
            <p className={`text-[11px] ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>Livello {levelInfo.level} · {levelInfo.name}</p>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50'}`}>
            <Flame className="w-4 h-4 text-amber-500" />
            <span className={`text-sm font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{streak}</span>
          </div>
          <button onClick={toggleDarkMode} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-night-800 text-night-400' : 'bg-night-100 text-night-500'}`}>
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={onOpenDrawer} className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isDarkMode ? 'bg-night-800 text-night-400' : 'bg-night-100 text-night-500'}`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
