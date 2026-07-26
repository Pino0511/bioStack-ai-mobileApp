import { useState } from 'react';
import {
  User, Moon, Bell, Shield, FileText, LogOut, ChevronRight, Sparkles,
  Target, Check, Info,
} from 'lucide-react';
import { useDarkMode } from './darkMode';
import { Card } from './ui';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { GOAL_LABELS } from '../lib/protocol';
import type { OnboardingAnswers, GoalId } from '../lib/types';

export default function ProfileScreen({
  answers,
  onAnswersChange,
}: {
  answers: OnboardingAnswers | null;
  onAnswersChange: (a: OnboardingAnswers) => void;
}) {
  const { dark, toggle } = useDarkMode();
  const { user, profile, signOut } = useAuth();
  const [editingGoals, setEditingGoals] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const goals: GoalId[] = answers
    ? [answers.goal, ...answers.secondaryGoals]
    : [];

  const toggleGoal = (g: GoalId) => {
    if (!answers) return;
    if (g === answers.goal) return;
    const has = answers.secondaryGoals.includes(g);
    onAnswersChange({
      ...answers,
      secondaryGoals: has
        ? answers.secondaryGoals.filter((x) => x !== g)
        : [...answers.secondaryGoals, g],
    });
  };

  const persistAnswers = async (a: OnboardingAnswers) => {
    if (!user) return;
    await supabase.from('profiles').update({
      goal: a.goal,
      secondary_goals: a.secondaryGoals,
      skin_type: a.skinType ?? null,
      sex: a.sex ?? null,
      energy_level: a.energyLevel,
      sleep_quality: a.sleepQuality,
      onboarding: a as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  const rowClass = `w-full flex items-center gap-3 p-3.5 rounded-2xl transition-colors ${
    dark ? 'bg-night-800 hover:bg-night-700' : 'bg-white border border-night-100 hover:bg-night-50'
  }`;

  return (
    <div className="px-5 pt-4 pb-6 animate-fade-in-up">
      <h1 className={`text-2xl font-bold mb-5 ${dark ? 'text-white' : 'text-night-900'}`}>Profilo</h1>

      {/* Profile card */}
      <Card className="p-5 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-bold ${dark ? 'text-white' : 'text-night-900'}`}>{profile?.name ?? 'Utente'}</p>
            <p className={`text-xs truncate ${dark ? 'text-night-400' : 'text-night-500'}`}>{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-sage-500" />
            <h2 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-night-900'}`}>I tuoi obiettivi</h2>
          </div>
          <button
            onClick={() => setEditingGoals((v) => !v)}
            className={`text-xs font-medium ${dark ? 'text-sage-400' : 'text-sage-600'}`}
          >
            {editingGoals ? 'Fatto' : 'Modifica'}
          </button>
        </div>

        {!editingGoals ? (
          <div className="flex flex-wrap gap-2">
            {goals.map((g) => (
              <span key={g} className="px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 text-xs font-medium">
                {GOAL_LABELS[g]}
              </span>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {(Object.keys(GOAL_LABELS) as GoalId[]).map((g) => {
              const isPrimary = answers?.goal === g;
              const isSecondary = answers?.secondaryGoals.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => !isPrimary && toggleGoal(g)}
                  disabled={isPrimary}
                  className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                    isPrimary || isSecondary
                      ? 'bg-sage-50 dark:bg-sage-900/20 border border-sage-300 dark:border-sage-700'
                      : dark ? 'bg-night-700' : 'bg-night-50'
                  } ${isPrimary ? 'opacity-80' : 'active:scale-[0.98]'}`}
                >
                  <span className={`text-sm font-medium ${dark ? 'text-white' : 'text-night-900'}`}>
                    {GOAL_LABELS[g]}{isPrimary && ' (principale)'}
                  </span>
                  {(isPrimary || isSecondary) && <Check className="w-4 h-4 text-sage-500" />}
                </button>
              );
            })}
            <button
              onClick={() => answers && persistAnswers(answers)}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 text-white text-sm font-semibold"
            >
              Salva obiettivi
            </button>
          </div>
        )}
      </Card>

      {/* Settings */}
      <div className="space-y-2 mb-4">
        <button onClick={toggle} className={rowClass}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-night-700' : 'bg-night-100'}`}>
            <Moon className="w-4.5 h-4.5 text-night-500" />
          </div>
          <span className={`flex-1 text-left text-sm font-medium ${dark ? 'text-white' : 'text-night-900'}`}>Dark mode</span>
          <div className={`w-11 h-6 rounded-full p-1 transition-all ${dark ? 'bg-sage-500' : 'bg-night-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-5' : ''}`} />
          </div>
        </button>

        <button onClick={() => setReminderEnabled((v) => !v)} className={rowClass}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-night-700' : 'bg-night-100'}`}>
            <Bell className="w-4.5 h-4.5 text-night-500" />
          </div>
          <span className={`flex-1 text-left text-sm font-medium ${dark ? 'text-white' : 'text-night-900'}`}>Promemoria routine</span>
          <div className={`w-11 h-6 rounded-full p-1 transition-all ${reminderEnabled ? 'bg-sage-500' : dark ? 'bg-night-600' : 'bg-night-300'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reminderEnabled ? 'translate-x-5' : ''}`} />
          </div>
        </button>

        <div className={rowClass}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-night-700' : 'bg-night-100'}`}>
            <Shield className="w-4.5 h-4.5 text-night-500" />
          </div>
          <span className={`flex-1 text-left text-sm font-medium ${dark ? 'text-white' : 'text-night-900'}`}>Privacy</span>
          <ChevronRight className="w-4 h-4 text-night-400" />
        </div>

        <div className={rowClass}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${dark ? 'bg-night-700' : 'bg-night-100'}`}>
            <FileText className="w-4.5 h-4.5 text-night-500" />
          </div>
          <span className={`flex-1 text-left text-sm font-medium ${dark ? 'text-white' : 'text-night-900'}`}>Fonti & disclaimer</span>
          <ChevronRight className="w-4 h-4 text-night-400" />
        </div>
      </div>

      {/* Disclaimer */}
      <div className={`flex items-start gap-2.5 p-3.5 rounded-2xl mb-4 text-xs leading-relaxed ${dark ? 'bg-night-800 text-night-400' : 'bg-night-50 text-night-500'}`}>
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>BioStack AI fornisce contenuti educativi basati su evidence-based wellness. Non sostituisce il parere di un medico. Consulta un professionista prima di intraprendere nuove abitudini o integratori.</span>
      </div>

      <button
        onClick={signOut}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] ${
          dark ? 'bg-night-800 text-red-400 hover:bg-red-900/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
        }`}
      >
        <LogOut className="w-4 h-4" />
        Esci dall'account
      </button>

      <p className={`text-center text-[10px] mt-6 ${dark ? 'text-night-600' : 'text-night-400'}`}>
        BioStack AI · v1.0 · Made with <Sparkles className="w-3 h-3 inline" />
      </p>

      {savedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-sage-500 text-white text-xs font-semibold shadow-lg z-50 animate-fade-in-up">
          <Check className="w-3.5 h-3.5 inline mr-1" /> Obiettivi salvati
        </div>
      )}
    </div>
  );
}
