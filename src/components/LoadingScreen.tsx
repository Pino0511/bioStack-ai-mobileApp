import { Sparkles, Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sage-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Caricamento...</span>
        </div>
      </div>
    </div>
  );
}
