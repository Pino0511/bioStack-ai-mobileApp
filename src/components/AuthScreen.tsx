import { useState } from 'react';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useDarkMode } from './darkMode';
import { Button } from './ui';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const { dark } = useDarkMode();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Inserisci email e password.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Inserisci il tuo nome.');
      return;
    }
    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.');
      return;
    }
    setLoading(true);
    const res = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, name);
    setLoading(false);
    if (res.error) setError(res.error);
  };

  const inputClass = `w-full pl-11 pr-4 py-4 rounded-2xl ${
    dark ? 'bg-night-800 border border-night-700 text-white' : 'bg-night-50 border border-night-100 text-night-900'
  } placeholder-night-400 focus:outline-none focus:border-sage-500 transition-colors`;

  return (
    <div className={`min-h-screen flex flex-col px-6 safe-top safe-bottom ${dark ? 'bg-night-900' : 'bg-gradient-to-b from-night-50 to-white'}`}>
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-sage-500/30">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-night-900'}`}>BioStack AI</h1>
          <p className={`text-sm ${dark ? 'text-night-400' : 'text-night-500'}`}>
            Il tuo protocollo giornaliero di glow up & longevità
          </p>
        </div>

        <div className={`flex p-1 rounded-2xl mb-6 ${dark ? 'bg-night-800' : 'bg-night-100'}`}>
          {(['signup', 'signin'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === m
                  ? 'bg-white dark:bg-night-700 text-sage-600 dark:text-sage-400 shadow-sm'
                  : 'text-night-500'
              }`}
            >
              {m === 'signup' ? 'Crea account' : 'Accedi'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
              <input
                type="text"
                placeholder="Come ti chiami?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              className={inputClass}
            />
            <button
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-night-400"
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-4 text-center bg-red-50 dark:bg-red-900/20 rounded-xl py-2.5 px-4">
            {error}
          </p>
        )}

        <div className="mt-6">
          <Button onClick={submit} loading={loading}>
            {loading ? 'Attendi...' : mode === 'signup' ? 'Inizia ora — gratis' : 'Accedi'}
          </Button>
        </div>

        <div className={`flex items-center justify-center gap-2 mt-8 text-xs ${dark ? 'text-night-500' : 'text-night-400'}`}>
          <Shield className="w-3.5 h-3.5" />
          <span>I tuoi dati restano privati. Nessun post pubblico.</span>
        </div>
      </div>
    </div>
  );
}
