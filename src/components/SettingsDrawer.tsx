import { X, LogOut, Sun, Moon, Mail, Crown, Sparkles } from 'lucide-react';

interface Props {
  isDarkMode: boolean;
  onClose: () => void;
  email: string | null;
  name: string | undefined;
  onSignOut: () => void;
  onToggleDarkMode: () => void;
  isPremium: boolean;
}

export default function SettingsDrawer({ isDarkMode, onClose, email, name, onSignOut, onToggleDarkMode, isPremium }: Props) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] ${isDarkMode ? 'bg-night-800' : 'bg-white'} p-6 animate-fade-in overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Impostazioni</h2>
          <button onClick={onClose} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-night-700 text-night-400' : 'bg-night-100 text-night-500'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{name || 'User'}</p>
              <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
                <Mail className="w-3 h-3" /> {email}
              </p>
            </div>
          </div>
          {isPremium && (
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 w-fit">
              <Crown className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-bold text-white">PRO</span>
            </div>
          )}
        </div>

        <button onClick={onToggleDarkMode} className={`w-full p-4 rounded-2xl flex items-center justify-between mb-3 ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
          <div className="flex items-center gap-3">
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-night-500" />}
            <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Modalità {isDarkMode ? 'Chiara' : 'Scura'}</span>
          </div>
          <div className={`w-11 h-6 rounded-full p-0.5 transition-colors ${isDarkMode ? 'bg-sage-500' : 'bg-night-200'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-5' : ''}`} />
          </div>
        </button>

        <button onClick={onSignOut} className="w-full p-4 rounded-2xl flex items-center gap-3 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Esci</span>
        </button>

        <p className="text-center text-xs text-night-400 mt-6">BioStack AI v1.0</p>
      </div>
    </div>
  );
}
