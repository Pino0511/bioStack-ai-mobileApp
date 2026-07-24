import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAuth } from './lib/useAuth';
import {
  fetchGamification, upsertGamification, fetchRoutineToday, upsertRoutineRow,
} from './lib/database';
import type { Activity, Product, GlowUpData, FacialReport } from './types';
import { getLevelInfo } from './types';
import type { NavTab } from './components/NavTypes';
import LoadingScreen from './components/LoadingScreen';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import AppHeader from './components/AppHeader';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import ProView from './components/ProView';
import BottomNav from './components/BottomNav';
import SettingsDrawer from './components/SettingsDrawer';

type RoutineTab = 'morning' | 'evening';
type ProductFilter = 'all' | 'skincare' | 'integrators' | 'tools';
type SubscriptionPlan = 'annual' | 'monthly';

const DEFAULT_MORNING: Activity[] = [
  { id: 'm1', name: 'Detergente Viso', duration: '2 min', completed: false, xp: 10 },
  { id: 'm2', name: 'Tonic Idratante', duration: '1 min', completed: false, xp: 10 },
  { id: 'm3', name: 'Siero Vitamina C', duration: '1 min', completed: false, xp: 10 },
  { id: 'm4', name: 'Crema Solare SPF50', duration: '1 min', completed: false, xp: 10 },
  { id: 'm5', name: 'Mewing 10 minuti', duration: '10 min', completed: false, xp: 15 },
];

const DEFAULT_EVENING: Activity[] = [
  { id: 'e1', name: 'Doppia Detersione', duration: '3 min', completed: false, xp: 10 },
  { id: 'e2', name: 'Esfoliante Chimico (2x/sett)', duration: '2 min', completed: false, xp: 15 },
  { id: 'e3', name: 'Siero Retinolo', duration: '1 min', completed: false, xp: 15 },
  { id: 'e4', name: 'Crema Notte Riparativa', duration: '1 min', completed: false, xp: 10 },
];

const DEFAULT_PRODUCTS: Product[] = [
  { id: 'p1', name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', price: 14.50, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B01N1WDFKJ', daysRemaining: 28, totalDays: 45 },
  { id: 'p2', name: 'The Ordinary Niacinamide 10%', brand: 'The Ordinary', price: 9.90, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B07H5DQXVJ', daysRemaining: 35, totalDays: 60 },
  { id: 'p3', name: "La Roche-Posay Anthelios SPF50+", brand: 'La Roche-Posay', price: 18.90, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B00N4V7R0M', daysRemaining: 42, totalDays: 60 },
  { id: 'p4', name: 'Omega-3 Fish Oil', brand: 'Nordic Naturals', price: 29.90, category: 'integrators', amazonUrl: 'https://amazon.it/dp/B0029JXIUS', daysRemaining: 60, totalDays: 90 },
  { id: 'p5', name: 'Collagen Peptides', brand: 'Vital Proteins', price: 39.90, category: 'integrators', amazonUrl: 'https://amazon.it/dp/B00XQ2S6S8', daysRemaining: 45, totalDays: 60 },
  { id: 'p6', name: 'Gua Sha Stone', brand: 'Mount Lai', price: 38.00, category: 'tools', amazonUrl: 'https://amazon.it/dp/B09KV3X8Q7' },
];

export default function App() {
  const auth = useAuth();
  const { userId, email, profile, loading: authLoading } = auth;

  // UI state
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [activeTab, setActiveTab] = useState<RoutineTab>('morning');
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Onboarding state
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState(25);
  const [goal, setGoal] = useState<'skincare' | 'posture' | 'focus' | null>(null);
  const [skinType, setSkinType] = useState<'dry' | 'oily' | 'combination' | null>(null);
  const [budget, setBudget] = useState<'low' | 'medium' | 'elite' | null>(null);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  // Premium state
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('annual');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [countdown, setCountdown] = useState(599);

  // Routine state
  const [morningActivities, setMorningActivities] = useState<Activity[]>(DEFAULT_MORNING);
  const [eveningActivities, setEveningActivities] = useState<Activity[]>(DEFAULT_EVENING);

  // Gamification state
  const [xpPoints, setXpPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  // Scan state
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [facialReport, setFacialReport] = useState<FacialReport | null>(null);
  const [showBiometricOverlay, setShowBiometricOverlay] = useState(false);

  // Progress diary state
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ symmetry: number; hydration: number; lines: number; glowUp: number } | null>(null);
  const [glowUpHistory, setGlowUpHistory] = useState<GlowUpData[]>([]);

  // Comparison slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const frontImageRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);

  const isDarkMode = profile?.dark_mode ?? false;
  const hasCompletedOnboarding = !!(profile?.goal && profile?.budget);
  const isPremiumUser = isPremium || (profile?.is_premium ?? false);

  // Load persisted data when user logs in
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const [g, routineRows] = await Promise.all([
          fetchGamification(userId),
          fetchRoutineToday(userId),
        ]);
        if (cancelled) return;
        if (g) {
          setXpPoints(g.xp_points);
          setStreakDays(g.streak_days);
        }
        const today = new Date().toISOString().slice(0, 10);
        if (routineRows.length) {
          const map = new Map(routineRows.map(r => [r.activity_id, r.completed]));
          setMorningActivities(prev => prev.map(a => ({ ...a, completed: map.get(a.id) ?? false })));
          setEveningActivities(prev => prev.map(a => ({ ...a, completed: map.get(a.id) ?? false })));
        }
      } catch {
        // keep defaults on error
      }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Countdown timer (only in pro demo)
  useEffect(() => {
    if (navTab !== 'pro' || isPremiumUser) return;
    const interval = setInterval(() => {
      setCountdown(c => (c > 0 ? c - 1 : 599));
    }, 1000);
    return () => clearInterval(interval);
  }, [navTab, isPremiumUser]);

  // Apply dark mode class to root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleActivity = useCallback(async (id: string, isMorning: boolean) => {
    const setList = isMorning ? setMorningActivities : setEveningActivities;
    let changedActivity: Activity | undefined;
    setList(prev => prev.map(a => {
      if (a.id === id) {
        changedActivity = { ...a, completed: !a.completed };
        return changedActivity;
      }
      return a;
    }));
    if (!userId || !changedActivity) return;
    const act = changedActivity;
    try {
      await upsertRoutineRow(userId, act.id, act.name, isMorning, act.completed);
      const xpDelta = act.completed ? act.xp : -act.xp;
      const newXp = Math.max(0, xpPoints + xpDelta);
      setXpPoints(newXp);
      await upsertGamification(userId, { xp_points: newXp });
    } catch {
      // revert on error
      setList(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
    }
  }, [userId, xpPoints]);

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPremium(true);
      if (userId) auth.updateProfile({ is_premium: true, subscription_plan: subscriptionPlan });
    }, 1500);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!emailInput || !passwordInput) { setAuthError('Inserisci email e password'); return; }
    if (passwordInput.length < 6) { setAuthError('La password deve avere almeno 6 caratteri'); return; }
    setAuthSubmitting(true);
    const { error } = authMode === 'signin'
      ? await auth.signIn(emailInput, passwordInput)
      : await auth.signUp(emailInput, passwordInput);
    setAuthSubmitting(false);
    if (error) { setAuthError(error); return; }
    setEmailInput(''); setPasswordInput('');
  };

  const completeOnboarding = async () => {
    if (!userId || !goal || !budget) return;
    setOnboardingLoading(true);
    await auth.updateProfile({
      name: nameInput || 'User',
      age: ageInput,
      goal,
      skin_type: skinType,
      budget,
    });
    setOnboardingLoading(false);
    setStep(1); setNameInput(''); setAgeInput(25); setGoal(null); setSkinType(null); setBudget(null);
  };

  const toggleDarkMode = () => { if (userId) auth.updateProfile({ dark_mode: !isDarkMode }); };

  const generateFacialReport = useCallback((): FacialReport => {
    const shapes = ['oval', 'square', 'diamond', 'heart', 'round', 'oblong'] as const;
    const faceShape = shapes[Math.floor(Math.random() * shapes.length)];
    const symmetry = Math.floor(Math.random() * 20) + 75;
    const jawAngle = Math.floor(Math.random() * 40) + 110;
    const skinQualities = ['excellent', 'good', 'fair', 'needs_attention'] as const;
    const skinQuality = skinQualities[Math.floor(Math.random() * 4)];
    const hairRecs: Record<string, { s: string; r: string }> = {
      oval: { s: 'Textured Crop o Quiff Laterale', r: "La forma ovale è universalmente versatile. Un textured crop esalta gli zigomi." },
      square: { s: 'Taper Fade con Curly Middle Part', r: "Il viso squadrato ha una mascella definita. Un fade alto riduce la larghezza alle tempie." },
      diamond: { s: 'Side Swept Fringe o Pompadour', r: "Gli zigomi alti beneficiano di volume laterale che ammorbidisce i contorni." },
      heart: { s: 'Medium Length Side Part', r: "La fronte ampia richiede equilibrio. Una frangia laterale riduce il volume frontale." },
      round: { s: 'High Fade con Pompadour', r: "Il viso rotondo necessita di definizione verticale. Un fade alto allunga visivamente." },
      oblong: { s: 'Side Part con Texture', r: "Il viso allungato richiede larghezza visuale per bilanciare." },
    };
    const beardRecs: Record<string, { s: string; r: string }> = {
      oval: { s: 'Full Beard Corta', r: "La forma ovale supporta quasi ogni stile." },
      square: { s: 'Pizzetto Accennato', r: "La mascella squadrata è già forte. Evita barbe piene." },
      diamond: { s: 'Full Beard con Sideburns', r: "Gli zigomi sporgenti beneficiano di volume mascellare." },
      heart: { s: 'Goatee Pieno', r: "Il mento appuntito necessita di volume." },
      round: { s: 'Van Dyke', r: "Il viso rotondo richiede definizione verticale." },
      oblong: { s: 'Sideburns Medi', r: "Il viso allungato necessita di larghezza." },
    };
    const eyeRecs: Record<string, { s: string[]; d: string }> = {
      oval: { s: ['Aviator', 'Wayfarer'], d: 'Forma ovale versatile. Puoi permetterti quasi ogni stile.' },
      square: { s: ['Round', 'Clubmaster'], d: 'Occhiali rotondi ammorbidiscono gli angoli forti.' },
      diamond: { s: ['Round', 'Cat-Eye'], d: 'Montature rotonde bilanciano gli zigomi prominenti.' },
      heart: { s: ['Wayfarer', 'Aviator'], d: 'Stili con base ampia bilanciano la fronte.' },
      round: { s: ['Rectangular', 'Geometric'], d: 'Montature angolate aggiungono definizione.' },
      oblong: { s: ['Oversized', 'Round'], d: 'Montature ampie aggiungono larghezza visuale.' },
    };
    const hair = hairRecs[faceShape], beard = beardRecs[faceShape], eye = eyeRecs[faceShape];
    return {
      faceShape, symmetry, jawAngle, skinQuality,
      hairRecommendation: hair.s, hairReason: hair.r,
      beardRecommendation: beard.s, beardReason: beard.r,
      eyewearRecommendation: eye.d, eyewearStyles: eye.s,
      glowUpScore: Math.floor(Math.random() * 25) + 60,
    };
  }, []);

  const startBiometricScan = () => {
    setIsScanning(true); setScanProgress(0); setShowBiometricOverlay(true);
    const start = Date.now(); const duration = 5000;
    const interval = setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      setScanProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setFacialReport(generateFacialReport());
        setShowBiometricOverlay(false);
        setIsScanning(false);
      }
    }, 50);
  };

  const analyzePhotos = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        symmetry: Math.floor(Math.random() * 20) + 75,
        hydration: Math.floor(Math.random() * 25) + 65,
        lines: Math.floor(Math.random() * 30) + 60,
        glowUp: Math.floor(Math.random() * 25) + 65,
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPosition(pct);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const currentActivities = activeTab === 'morning' ? morningActivities : eveningActivities;
  const completedCount = currentActivities.filter(a => a.completed).length;
  const allActivities = [...morningActivities, ...eveningActivities];
  const totalCompleted = allActivities.filter(a => a.completed).length;
  const levelInfo = useMemo(() => getLevelInfo(xpPoints), [xpPoints]);
  const todayDate = new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

  const filteredProducts = useMemo(() => {
    return DEFAULT_PRODUCTS.filter(p =>
      (productFilter === 'all' || p.category === productFilter) &&
      (searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [productFilter, searchQuery]);

  if (authLoading) return <LoadingScreen />;
  if (!userId) return (
    <AuthScreen
      mode={authMode} setMode={setAuthMode}
      email={emailInput} setEmail={setEmailInput}
      password={passwordInput} setPassword={setPasswordInput}
      showPassword={showPassword} setShowPassword={setShowPassword}
      error={authError} submitting={authSubmitting}
      onSubmit={handleAuthSubmit}
    />
  );
  if (profile && !hasCompletedOnboarding) return (
    <OnboardingFlow
      step={step} setStep={setStep}
      name={nameInput} setName={setNameInput}
      age={ageInput} setAge={setAgeInput}
      goal={goal} setGoal={setGoal}
      skinType={skinType} setSkinType={setSkinType}
      budget={budget} setBudget={setBudget}
      onComplete={completeOnboarding} loading={onboardingLoading}
      email={email}
    />
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-night-900' : 'bg-night-50'}`}>
      <AppHeader isDarkMode={isDarkMode} levelInfo={levelInfo} streak={streakDays} onOpenDrawer={() => setIsDrawerOpen(true)} toggleDarkMode={toggleDarkMode} />
      <main className="pb-24 max-w-lg mx-auto">
        {navTab === 'home' && (
          <HomeView
            isDarkMode={isDarkMode} isPremium={isPremiumUser}
            todayDate={todayDate} activeTab={activeTab} setActiveTab={setActiveTab}
            currentActivities={currentActivities} completedCount={completedCount}
            toggleActivity={toggleActivity} xpPoints={xpPoints}
            levelInfo={levelInfo} streak={streakDays}
            frontImage={frontImage} profileImage={profileImage}
            isScanning={isScanning} scanProgress={scanProgress}
            facialReport={facialReport} showBiometricOverlay={showBiometricOverlay}
            frontImageRef={frontImageRef} profileImageRef={profileImageRef}
            onFrontUpload={(e) => handleImageUpload(e, setFrontImage)}
            onProfileUpload={(e) => handleImageUpload(e, setProfileImage)}
            startScan={startBiometricScan}
          />
        )}
        {navTab === 'products' && (
          <ProductsView
            isDarkMode={isDarkMode} isPremium={isPremiumUser}
            products={filteredProducts} filter={productFilter}
            setFilter={setProductFilter} searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            beforePhoto={beforePhoto} afterPhoto={afterPhoto}
            isAnalyzing={isAnalyzing} analysisResult={analysisResult}
            sliderPosition={sliderPosition} sliderRef={sliderRef}
            isDragging={isDragging} setIsDragging={setIsDragging}
            handleSliderMove={handleSliderMove}
            beforePhotoRef={beforePhotoRef} afterPhotoRef={afterPhotoRef}
            onBeforeUpload={(e) => handleImageUpload(e, setBeforePhoto)}
            onAfterUpload={(e) => handleImageUpload(e, setAfterPhoto)}
            analyzePhotos={analyzePhotos}
          />
        )}
        {navTab === 'pro' && (
          <ProView
            isDarkMode={isDarkMode} isPremium={isPremiumUser}
            subscriptionPlan={subscriptionPlan}
            setSubscriptionPlan={setSubscriptionPlan}
            onPayment={handlePayment} isProcessingPayment={isProcessingPayment}
            countdown={countdown}
            glowUpHistory={glowUpHistory}
            totalCompleted={totalCompleted} xpPoints={xpPoints}
            streak={streakDays}
          />
        )}
      </main>
      <BottomNav navTab={navTab} setNavTab={setNavTab} isDarkMode={isDarkMode} isPremium={isPremiumUser} />
      {isDrawerOpen && (
        <SettingsDrawer
          isDarkMode={isDarkMode} onClose={() => setIsDrawerOpen(false)}
          email={email} name={profile?.name}
          onSignOut={auth.signOut} onToggleDarkMode={toggleDarkMode}
          isPremium={isPremiumUser}
        />
      )}
    </div>
  );
}

