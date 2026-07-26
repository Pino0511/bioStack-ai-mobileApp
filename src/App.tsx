import { useEffect, useMemo, useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { DarkModeProvider, useDarkMode } from './components/darkMode';
import { useDailyProtocol } from './lib/useDailyProtocol';
import type { OnboardingAnswers, Slot } from './lib/types';
import { supabase } from './lib/supabase';

import AuthScreen from './components/AuthScreen';
import WelcomeScreen from './components/WelcomeScreen';
import OnboardingScreen from './components/OnboardingScreen';
import ResultScreen from './components/ResultScreen';
import HomeScreen from './components/HomeScreen';
import ProtocolScreen from './components/ProtocolScreen';
import InsightsScreen from './components/InsightsScreen';
import StackScreen from './components/StackScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav, { type AppTab } from './components/BottomNav';
import { Skeleton } from './components/ui';

type Phase = 'loading' | 'welcome' | 'onboarding' | 'result' | 'app';

function Shell() {
  const { user, profile, loading } = useAuth();
  const { dark } = useDarkMode();

  // Determine starting phase based on profile state
  const [phase, setPhase] = useState<Phase>('loading');
  const [answers, setAnswers] = useState<OnboardingAnswers | null>(null);
  const [tab, setTab] = useState<AppTab>('home');
  const [protocolSlot, setProtocolSlot] = useState<Slot>('morning');
  const protocol = useDailyProtocol(user?.id, answers);
  const xpToday = useMemo(() => {
    if (!protocol.activities || !protocol.stats) return 0;
    return protocol.activities.filter((a) => a.completed).reduce((s, a) => s + a.xp, 0);
  }, [protocol.activities, protocol.stats]);

  // Hydrate answers from profile.onboarding
  useEffect(() => {
    if (loading) return;
    if (!user) {
      setPhase('loading');
      return;
    }
    const ob = profile?.onboarding as Partial<OnboardingAnswers> | null;
    if (ob && ob.goal) {
      const full: OnboardingAnswers = {
        goal: ob.goal,
        secondaryGoals: ob.secondaryGoals ?? [],
        age: ob.age ?? profile?.age ?? 25,
        sex: ob.sex ?? (profile?.sex as OnboardingAnswers['sex']) ?? undefined,
        energyLevel: ob.energyLevel ?? profile?.energy_level ?? 3,
        sleepQuality: ob.sleepQuality ?? profile?.sleep_quality ?? 3,
        stressLevel: ob.stressLevel ?? 3,
        workoutFrequency: ob.workoutFrequency ?? 2,
        skinType: ob.skinType ?? (profile?.skin_type as OnboardingAnswers['skinType']) ?? undefined,
        limitations: ob.limitations ?? [],
      };
      setAnswers(full);
      setPhase('app');
    } else {
      setPhase('welcome');
    }
  }, [user, profile, loading]);

  // When we have answers and enter the app, ensure today's rows exist
  useEffect(() => {
    if (phase === 'app' && answers && user) {
      protocol.ensureToday(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, answers, user]);

  const persistOnboarding = async (a: OnboardingAnswers) => {
    setAnswers(a);
    if (!user) return;
    await supabase.from('profiles').upsert({
      id: user.id,
      goal: a.goal,
      secondary_goals: a.secondaryGoals,
      skin_type: a.skinType ?? null,
      sex: a.sex ?? null,
      energy_level: a.energyLevel,
      sleep_quality: a.sleepQuality,
      onboarding: a as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    });
  };

  // ===== Render gates =====
  if (loading || phase === 'loading') {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center ${dark ? 'bg-night-900' : 'bg-night-50'}`}>
        <Skeleton className="w-16 h-16 rounded-3xl mb-4" />
        <Skeleton className="w-32 h-4" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (phase === 'welcome')
    return (
      <WelcomeScreen
        onStart={() => setPhase('onboarding')}
        onDemo={() => {
          const demo: OnboardingAnswers = {
            goal: 'skincare',
            secondaryGoals: ['focus'],
            age: 25,
            energyLevel: 3,
            sleepQuality: 3,
            stressLevel: 3,
            workoutFrequency: 2,
            skinType: 'combination',
          };
          setAnswers(demo);
          setPhase('result');
        }}
      />
    );

  if (phase === 'onboarding')
    return (
      <OnboardingScreen
        initial={answers ?? {}}
        onBack={() => setPhase('welcome')}
        onComplete={async (a) => {
          await persistOnboarding(a);
          setPhase('result');
        }}
      />
    );

  if (phase === 'result' && answers)
    return <ResultScreen answers={answers} onEnter={() => setPhase('app')} />;

  // ===== Main app =====
  return (
    <div className={`min-h-screen safe-top ${dark ? 'bg-night-900' : 'bg-night-50'}`}>
      <div className="app-shell pb-24">
        {tab === 'home' && (
          <HomeScreen
            loading={protocol.loading}
            error={protocol.error}
            activities={protocol.activities}
            stats={protocol.stats}
            answers={answers}
            completedPct={protocol.completedPct}
            completedBySlot={protocol.completedBySlot}
            streakBonus={xpToday}
            onGoToProtocol={(slot) => {
              setProtocolSlot(slot);
              setTab('protocol');
            }}
            onRetry={() => user && protocol.ensureToday(answers!)}
          />
        )}
        {tab === 'protocol' && (
          <ProtocolScreen
            activities={protocol.activities}
            completedBySlot={protocol.completedBySlot}
            initialSlot={protocolSlot}
            onToggle={protocol.toggle}
          />
        )}
        {tab === 'insights' && <InsightsScreen />}
        {tab === 'stack' && <StackScreen answers={answers} />}
        {tab === 'profile' && (
          <ProfileScreen
            answers={answers}
            onAnswersChange={(a) => {
              setAnswers(a);
              persistOnboarding(a);
            }}
          />
        )}
      </div>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </DarkModeProvider>
  );
}
