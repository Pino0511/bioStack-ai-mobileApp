import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  mode: 'signin' | 'signup';
  setMode: (m: 'signin' | 'signup') => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  error: string | null;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AuthScreen({
  mode, setMode, email, setEmail, password, setPassword,
  showPassword, setShowPassword, error, submitting, onSubmit,
}: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-night-900">BioStack AI</h1>
          <p className="text-sm text-night-500 mt-1">
            {mode === 'signin' ? 'Accedi al tuo account' : 'Crea il tuo account'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-night-600 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="nome@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-night-200 text-night-900 placeholder-night-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-night-600 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400" />
              <input
                type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-white border border-night-200 text-night-900 placeholder-night-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-night-400 hover:text-night-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70">
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Caricamento...</>
            ) : (
              mode === 'signin' ? 'Accedi' : 'Registrati'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-night-500 mt-6">
          {mode === 'signin' ? "Non hai un account? " : 'Hai già un account? '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); }}
            className="text-sage-600 font-semibold hover:underline">
            {mode === 'signin' ? 'Registrati' : 'Accedi'}
          </button>
        </p>
      </div>
    </div>
  );
}
