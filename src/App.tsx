import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Sparkles, Droplets, Brain, ChevronRight, User, Wallet, Loader as Loader2, CircleCheck as CheckCircle2, TrendingUp, Sun, Moon, Hop as Home, Package, Search, X, ExternalLink, Scan, Upload, Crown, Clock, Shield, ChartBar as BarChart3, Target, Mail, Lock, Eye, EyeOff, Settings, Circle as HelpCircle, LogOut, CreditCard as Edit3, Calendar, ChevronLeft, BookOpen, ArrowLeft, Flame, Heart, Camera, CircleAlert as AlertCircle, Bell, Trophy, Send, ChevronDown, FileText, Scale, ArrowLeftRight, RefreshCw, Zap, Activity } from 'lucide-react';

type NavTab = 'home' | 'products' | 'pro';
type RoutineTab = 'morning' | 'evening';
type ProductFilter = 'all' | 'skincare' | 'integrators' | 'tools';
type SubscriptionPlan = 'annual' | 'monthly';

interface Activity {
  id: string;
  name: string;
  duration?: string;
  completed: boolean;
  xp: number;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: 'skincare' | 'integrators' | 'tools';
  amazonUrl: string;
  imageUrl?: string;
  aiReason?: string;
  daysRemaining?: number;
  totalDays?: number;
  startDate?: Date;
}

interface ProgressPhoto {
  id: string;
  imageUrl: string;
  date: Date;
  analysisScore?: number;
}

interface GlowUpData {
  week: number;
  score: number;
  date: Date;
}

interface FacialReport {
  faceShape: 'oval' | 'square' | 'diamond' | 'heart' | 'round' | 'oblong';
  symmetry: number;
  jawAngle: number;
  skinQuality: 'excellent' | 'good' | 'fair' | 'needs_attention';
  hairRecommendation: string;
  hairReason: string;
  beardRecommendation: string;
  beardReason: string;
  eyewearRecommendation: string;
  eyewearStyles: string[];
  glowUpScore: number;
  weeklyTrend: GlowUpData[];
}

export default function App() {
  // Auth & User State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<'skincare' | 'posture' | 'focus' | null>(null);
  const [skinType, setSkinType] = useState<'dry' | 'oily' | 'combination' | null>(null);
  const [budget, setBudget] = useState<'low' | 'medium' | 'elite' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation & UI State
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [activeTab, setActiveTab] = useState<RoutineTab>('morning');
  const [productFilter, setProductFilter] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Premium State
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>('annual');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [countdown, setCountdown] = useState(599);

  // Gamification State
  const [xpPoints, setXpPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);

  // Routine State
  const [morningActivities, setMorningActivities] = useState<Activity[]>([]);
  const [eveningActivities, setEveningActivities] = useState<Activity[]>([]);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);

  // Scan State
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [facialReport, setFacialReport] = useState<FacialReport | null>(null);
  const [showBiometricOverlay, setShowBiometricOverlay] = useState(false);

  // Progress Diary State
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ symmetry: number; hydration: number; lines: number; glowUp: number } | null>(null);
  const [glowUpHistory, setGlowUpHistory] = useState<GlowUpData[]>([]);

  // Comparison Slider State
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const frontImageRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);

  // Completed percentage
  const completedPercentage = useMemo(() => {
    const allActivities = [...morningActivities, ...eveningActivities];
    if (allActivities.length === 0) return 0;
    const completed = allActivities.filter(a => a.completed).length;
    return Math.round((completed / allActivities.length) * 100);
  }, [morningActivities, eveningActivities]);

  // Level info
  const getLevelInfo = useCallback((xp: number) => {
    if (xp >= 3000) return { level: 5, name: 'Maestro Longevità', nextXp: 5000, progress: ((xp - 3000) / 2000) * 100 };
    if (xp >= 1500) return { level: 4, name: 'BioHacker Elite', nextXp: 3000, progress: ((xp - 1500) / 1500) * 100 };
    if (xp >= 700) return { level: 3, name: 'Esperto Pelle', nextXp: 1500, progress: ((xp - 700) / 800) * 100 };
    if (xp >= 300) return { level: 2, name: 'Apprendista', nextXp: 700, progress: ((xp - 300) / 400) * 100 };
    return { level: 1, name: 'Novizio', nextXp: 300, progress: (xp / 300) * 100 };
  }, []);

  const levelInfo = useMemo(() => getLevelInfo(xpPoints), [xpPoints, getLevelInfo]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Generate initial data
  useEffect(() => {
    if (showDashboard && !hasCompletedOnboarding) {
      const morning: Activity[] = [
        { id: 'm1', name: 'Detergente Viso', duration: '2 min', completed: false, xp: 10 },
        { id: 'm2', name: 'Tonic Idratante', duration: '1 min', completed: false, xp: 10 },
        { id: 'm3', name: 'Siero Vitamina C', duration: '1 min', completed: false, xp: 10 },
        { id: 'm4', name: ' crema Solare SPF50', duration: '1 min', completed: false, xp: 10 },
        { id: 'm5', name: 'Mewing 10 minuti', duration: '10 min', completed: false, xp: 15 },
      ];
      const evening: Activity[] = [
        { id: 'e1', name: 'Doppia Detersione', duration: '3 min', completed: false, xp: 10 },
        { id: 'e2', name: 'Esfoliante Chimico (2x/sett)', duration: '2 min', completed: false, xp: 15 },
        { id: 'e3', name: 'Siero Retinolo', duration: '1 min', completed: false, xp: 15 },
        { id: 'e4', name: 'Crema Notte Riparativa', duration: '1 min', completed: false, xp: 10 },
      ];
      setMorningActivities(morning);
      setEveningActivities(evening);

      const initialProducts: Product[] = [
        { id: 'p1', name: 'CeraVe Hydrating Cleanser', brand: 'CeraVe', price: 14.50, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B01N1WDFKJ', daysRemaining: 28, totalDays: 45, startDate: new Date() },
        { id: 'p2', name: 'The Ordinary Niacinamide 10%', brand: 'The Ordinary', price: 9.90, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B07H5DQXVJ', daysRemaining: 35, totalDays: 60, startDate: new Date() },
        { id: 'p3', name: 'La Roche-Posay Anthelios SPF50+', brand: 'La Roche-Posay', price: 18.90, category: 'skincare', amazonUrl: 'https://amazon.it/dp/B00N4V7R0M', daysRemaining: 42, totalDays: 60, startDate: new Date() },
        { id: 'p4', name: 'Omega-3 Fish Oil', brand: 'Nordic Naturals', price: 29.90, category: 'integrators', amazonUrl: 'https://amazon.it/dp/B0029JXIUS', daysRemaining: 60, totalDays: 90, startDate: new Date() },
        { id: 'p5', name: 'Collagen Peptides', brand: 'Vital Proteins', price: 39.90, category: 'integrators', amazonUrl: 'https://amazon.it/dp/B00XQ2S6S8', daysRemaining: 45, totalDays: 60, startDate: new Date() },
        { id: 'p6', name: 'Gua Sha Stone', brand: 'Mount Lai', price: 38.00, category: 'tools', amazonUrl: 'https://amazon.it/dp/B09KV3X8Q7', daysRemaining: -1, totalDays: -1, startDate: new Date() },
      ];
      setProducts(initialProducts);

      // Generate mock glow up history
      const history: GlowUpData[] = [];
      let score = 45;
      for (let i = 1; i <= 8; i++) {
        score += Math.floor(Math.random() * 8) + 2;
        history.push({
          week: i,
          score: Math.min(score, 95),
          date: new Date(Date.now() - (8 - i) * 7 * 24 * 60 * 60 * 1000)
        });
      }
      setGlowUpHistory(history);
    }
  }, [showDashboard, hasCompletedOnboarding]);

  // Toggle activity
  const toggleActivity = (activityId: string, isMorning: boolean) => {
    const updateActivities = (activities: Activity[]) =>
      activities.map(a => {
        if (a.id === activityId) {
          if (!a.completed) {
            setXpPoints(prev => prev + a.xp);
          } else {
            setXpPoints(prev => Math.max(0, prev - a.xp));
          }
          return { ...a, completed: !a.completed };
        }
        return a;
      });

    if (isMorning) {
      setMorningActivities(updateActivities);
    } else {
      setEveningActivities(updateActivities);
    }

    // Update streak if 100% completed
    if (completedPercentage === 100) {
      setStreakDays(prev => prev + 1);
    }
  };

  // Handle payment
  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPremium(true);
    }, 2000);
  };

  // Handle social auth
  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setIsAuthLoading(true);
    setTimeout(() => {
      if (provider === 'google') {
        setName('Jacopo');
        setEmail('jacopo.user@gmail.com');
      } else {
        setName('Jacopo');
        setEmail('jacopo@icloud.com');
      }
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setHasCompletedOnboarding(false);
      setStep(1);
    }, 2000);
  };

  // Handle auth
  const handleAuth = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setHasCompletedOnboarding(false);
    }, 1500);
  };

  // Handle onboarding next
  const handleNext = async () => {
    if (step === 3 && goal && budget) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowDashboard(true);
        setHasCompletedOnboarding(true);
      }, 3000);
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  // Start biometric scan
  const startBiometricScan = () => {
    if (!frontImage || !profileImage) return;
    setIsScanning(true);
    setScanProgress(0);
    setShowBiometricOverlay(true);

    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setScanProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        generateFacialReport();
        setIsScanning(false);
      }
    }, 50);
  };

  // Generate facial report
  const generateFacialReport = () => {
    const shapes: FacialReport['faceShape'][] = ['oval', 'square', 'diamond', 'heart', 'round', 'oblong'];
    const faceShape = shapes[Math.floor(Math.random() * shapes.length)];
    const symmetry = Math.floor(Math.random() * 15) + 82;
    const jawAngle = Math.floor(Math.random() * 30) + 115;
    const skinQualities: FacialReport['skinQuality'][] = ['excellent', 'good', 'fair', 'needs_attention'];
    const skinQuality = skinQualities[Math.floor(Math.random() * skinQualities.length)];
    const glowUpScore = Math.floor(Math.random() * 20) + 75;

    const hairRecs: Record<string, { style: string; reason: string }> = {
      oval: { style: 'Textured Crop o Quiff Laterale', reason: 'La forma ovale è universalmente versatile. Un textured crop esalta gli zigomi.' },
      square: { style: 'Taper Fade con Curly Middle Part', reason: 'Il viso squadrato benefici di volume sopra per bilanciare.' },
      diamond: { style: 'Side Swept Fringe o Pompadour', reason: 'Gli zigomi alti richiedono volume laterale.' },
      heart: { style: 'Medium Length Side Part', reason: 'La fronte ampia richiede equilibrio con volume inferiore.' },
      round: { style: 'High Fade con Pompadour', reason: 'Il viso rotondo necessita di definizione verticale.' },
      oblong: { style: 'Side Part con Texture', reason: 'Il viso allungato richiede larghezza visuale.' }
    };

    const beardRecs: Record<string, { style: string; reason: string }> = {
      oval: { style: 'Full Beard Corta o Stubble Design', reason: 'La forma ovale supporta quasi ogni stile.' },
      square: { style: 'Pizzetto Accennato o Goatee', reason: 'Evitare barbe piene per non appesantire.' },
      diamond: { style: 'Full Beard con Sideburns Corti', reason: 'Volume mascellare per arrotondare i contorni.' },
      heart: { style: 'Goatee Pieno o Circle Beard', reason: 'Volume sul mento per bilanciare la fronte.' },
      round: { style: 'Van Dyke o Soul Patch', reason: 'Definizione verticale senza aggiungere larghezza.' },
      oblong: { style: 'Sideburns Medi o Barba Laterale', reason: 'Espansione orizzontale per bilanciare.' }
    };

    const eyewearRecs: Record<string, { styles: string[]; desc: string }> = {
      oval: { styles: ['Aviator', 'Wayfarer', 'Round'], desc: 'Forma versatile. Puoi permetterti quasi ogni stile.' },
      square: { styles: ['Round', 'Clubmaster', 'Oval'], desc: 'Occhiali rotondi ammorbidiscono gli angoli.' },
      diamond: { styles: ['Round', 'Cat-Eye', 'Clubmaster'], desc: 'Angoli morbidi alle tempie armonizzano.' },
      heart: { styles: ['Wayfarer', 'Aviator', 'Round'], desc: 'Stili con base ampia bilanciano la fronte.' },
      round: { styles: ['Rectangular', 'Wayfarer', 'Geometric'], desc: 'Montature angolate aggiungono struttura.' },
      oblong: { styles: ['Oversized', 'Round', 'Aviator'], desc: 'Montature ampie aggiungono larghezza visuale.' }
    };

    const hair = hairRecs[faceShape];
    const beard = beardRecs[faceShape];
    const eyewear = eyewearRecs[faceShape];

    // Add current score to history
    const newHistory = [...glowUpHistory];
    newHistory.push({
      week: newHistory.length + 1,
      score: glowUpScore,
      date: new Date()
    });
    setGlowUpHistory(newHistory);

    setFacialReport({
      faceShape,
      symmetry,
      jawAngle,
      skinQuality,
      hairRecommendation: hair.style,
      hairReason: hair.reason,
      beardRecommendation: beard.style,
      beardReason: beard.reason,
      eyewearRecommendation: eyewear.desc,
      eyewearStyles: eyewear.styles,
      glowUpScore,
      weeklyTrend: newHistory
    });
  };

  // Comparison slider handlers
  const handleSliderMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    updateSliderPosition(e);
  };

  const updateSliderPosition = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as MouseEvent).clientX;
    }

    const position = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateSliderPosition(e);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        updateSliderPosition(e);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesFilter = productFilter === 'all' || p.category === productFilter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [products, productFilter, searchQuery]);

  // Rendering helpers
  const renderBiometricOverlay = () => (
    <div className="biometric-grid">
      {/* Animated scan line */}
      {isScanning && <div className="scan-line" />}

      {/* Facial landmark points */}
      <div className="facial-point" style={{ left: '28%', top: '25%' }} />
      <div className="facial-point" style={{ left: '72%', top: '25%' }} />
      <div className="facial-point" style={{ left: '50%', top: '35%' }} />
      <div className="facial-point" style={{ left: '35%', top: '50%' }} />
      <div className="facial-point" style={{ left: '65%', top: '50%' }} />
      <div className="facial-point" style={{ left: '50%', top: '55%' }} />
      <div className="facial-point" style={{ left: '30%', top: '70%' }} />
      <div className="facial-point" style={{ left: '50%', top: '72%' }} />
      <div className="facial-point" style={{ left: '70%', top: '70%' }} />

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="28" y1="25" x2="50" y2="35" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="72" y1="25" x2="50" y2="35" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="28" y1="25" x2="35" y2="50" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="72" y1="25" x2="65" y2="50" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="50" y1="55" x2="50" y2="72" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="30" y1="70" x2="50" y2="72" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="70" y1="70" x2="50" y2="72" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />
        <line x1="30" y1="70" x2="70" y2="70" stroke="rgba(0,255,136,0.5)" strokeWidth="0.3" />

        {/* Measurement circles */}
        <circle cx="50" cy="47" r="18" fill="none" stroke="rgba(0,255,136,0.3)" strokeWidth="0.2" />
        <ellipse cx="50" cy="40" rx="15" ry="20" fill="none" stroke="rgba(0,255,136,0.2)" strokeWidth="0.2" />
      </svg>
    </div>
  );

  const renderGrowthChart = () => (
    <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
          Curva del tuo Glow Up
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-600">
          8 settimane
        </span>
      </div>

      <div className="relative h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Chart area */}
          <path
            d={`M 0 ${120 - glowUpHistory[0]?.score * 1.1 || 60} ${glowUpHistory.map((d, i) =>
              `L ${i * (300 / Math.max(glowUpHistory.length - 1, 1))} ${120 - d.score * 1.1}`
            ).join(' ')} L ${300} 120 L 0 120 Z`}
            fill="url(#chartGradient)"
          />

          {/* Chart line */}
          <path
            d={`M 0 ${120 - glowUpHistory[0]?.score * 1.1 || 60} ${glowUpHistory.map((d, i) =>
              `L ${i * (300 / Math.max(glowUpHistory.length - 1, 1))} ${120 - d.score * 1.1}`
            ).join(' ')}`}
            className="chart-line"
          />

          {/* Data points */}
          {glowUpHistory.map((d, i) => (
            <circle
              key={i}
              cx={i * (300 / Math.max(glowUpHistory.length - 1, 1))}
              cy={120 - d.score * 1.1}
              r="4"
              className="chart-dot"
            />
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-night-400">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] text-night-400 px-6">
        {glowUpHistory.map((d, i) => (
          <span key={i}>W{i + 1}</span>
        ))}
      </div>
    </div>
  );

  const renderComparisonSlider = () => (
    <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
          Slider Prima/Dopo
        </h3>
        <span className="text-xs px-2 py-1 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-600">
          Interattivo
        </span>
      </div>

      {beforePhoto && afterPhoto ? (
        <div
          ref={sliderRef}
          className="compare-slider-container relative aspect-[4/3] rounded-xl overflow-hidden"
          onMouseDown={handleSliderMouseDown}
          onTouchStart={handleSliderMouseDown}
        >
          {/* Before image (full width, clipped) */}
          <img
            src={beforePhoto}
            alt="Prima"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          />

          {/* After image (full width) */}
          <img
            src={afterPhoto}
            alt="Dopo"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Slider handle */}
          <div
            className="compare-slider-handle"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-sage-600" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
            PRIMA
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
            DOPO
          </div>
        </div>
      ) : (
        <div className={`aspect-[4/3] rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
          <div className="text-center">
            <Camera className={`w-12 h-12 mx-auto mb-2 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
              Carica foto Prima & Dopo per confrontare
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderProductCard = (product: Product) => (
    <div
      key={product.id}
      className={`rounded-2xl p-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-night-400' : 'text-night-400'}`}>
            {product.brand}
          </p>
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
            {product.name}
          </h3>
        </div>
        {isPremium && product.daysRemaining !== undefined && product.daysRemaining > 0 && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.daysRemaining <= 7
              ? 'bg-red-100 text-red-600'
              : product.daysRemaining <= 14
                ? 'bg-amber-100 text-amber-600'
                : 'bg-sage-100 text-sage-600'
          }`}>
            {product.daysRemaining} giorni
          </span>
        )}
      </div>

      <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
        {product.price.toFixed(2).replace('.', ',')}€
      </p>

      {isPremium && product.daysRemaining !== undefined && product.daysRemaining > 0 && (
        <div className="mt-2 mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className={isDarkMode ? 'text-night-400' : 'text-night-500'}>
              Durata stimata
            </span>
            <span className={`${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>
              {product.daysRemaining}/{product.totalDays} giorni rimasti
            </span>
          </div>
          <div className={`h-1.5 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-200'}`}>
            <div
              className={`h-1.5 rounded-full transition-all ${
                product.daysRemaining <= 7
                  ? 'bg-red-500'
                  : product.daysRemaining <= 14
                    ? 'bg-amber-500'
                    : 'bg-sage-500'
              }`}
              style={{ width: `${(product.daysRemaining / (product.totalDays || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {product.daysRemaining !== undefined && product.daysRemaining <= 7 && product.daysRemaining > 0 && (
        <div className="mb-3 p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
              Mancano {product.daysRemaining} giorni - Rinfresca lo stack!
            </span>
          </div>
        </div>
      )}

      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2.5 rounded-xl bg-sage-500 text-white font-medium text-center text-sm hover:bg-sage-600 transition-all"
      >
        <span className="flex items-center justify-center gap-2">
          Acquista su Amazon
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </a>
    </div>
  );

  // ========== RENDER ==========

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-night-50 to-white flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-lg shadow-sage-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-night-900 mb-2">BioStack AI</h1>
            <p className="text-night-500">Ottimizza il tuo Glow Up</p>
          </div>

          <div className="space-y-3 mb-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-night-200 text-night-900 placeholder-night-400 focus:outline-none focus:border-sage-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-night-200 text-night-900 placeholder-night-400 focus:outline-none focus:border-sage-500 transition-colors"
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={isAuthLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-sage-600 hover:to-sage-700 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isAuthLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accedi'}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-night-200" />
            <span className="text-night-400 text-sm">oppure</span>
            <div className="flex-1 h-px bg-night-200" />
          </div>

          <button
            onClick={() => handleSocialAuth('google')}
            disabled={isAuthLoading}
            className="w-full py-3.5 rounded-xl bg-white border border-night-200 text-night-700 font-medium flex items-center justify-center gap-3 hover:bg-night-50 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isAuthLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.23v2.84C4.04 20.78 7.77 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.23H2.23C1.42 8.89 1 10.71 1 12.5s.42 3.61 1.23 5.27l3.61-2.84v-.84z"/>
                <path fill="#EA4335" d="M12 5.14c1.61 0 3.05.56 4.18 1.64l3.13-3.13C17.46 2.09 14.97 1 12 1 7.77 1 4.04 3.23 2.23 6.23L5.84 9.1c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continua con Google
          </button>

          <button
            onClick={() => handleSocialAuth('apple')}
            disabled={isAuthLoading}
            className="w-full py-3.5 rounded-xl bg-night-900 text-white font-medium flex items-center justify-center gap-3 hover:bg-night-800 transition-all active:scale-[0.98] disabled:opacity-50 mt-3"
          >
            {isAuthLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.35-2.04.54-3.14.54-5.24 0-9.5-4.26-9.5-9.5S8.67 1.82 13.91 1.82c1.1 0 2.16.19 3.14.54C14.67 1.04 12.38 0 9.82 0 4.4 0 0 4.4 0 9.82s4.4 9.82 9.82 9.82c2.56 0 4.85-1.04 7.23-1.36z"/>
              </svg>
            )}
            Continua con Apple
          </button>
        </div>
      </div>
    );
  }

  if (!showDashboard && !hasCompletedOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-night-50 to-white flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-night-900 mb-2">Personalizza il tuo Protocollo</h2>
            <p className="text-night-500">Passo {step} di 3</p>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-night-600 mb-3">Qual è il tuo obiettivo principale?</p>
              {[
                { id: 'skincare', label: 'Skincare & Anti-Aging', icon: Droplets },
                { id: 'posture', label: 'Postura & Mewing', icon: Target },
                { id: 'focus', label: 'Focus & Longevità', icon: Brain },
              ].map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id as typeof goal)}
                  className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${
                    goal === g.id
                      ? 'bg-sage-50 border-2 border-sage-500'
                      : 'bg-white border-2 border-night-200 hover:border-sage-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    goal === g.id ? 'bg-sage-500 text-white' : 'bg-night-100 text-night-500'
                  }`}>
                    <g.icon className="w-5 h-5" />
                  </div>
                  <span className={`font-medium ${goal === g.id ? 'text-sage-700' : 'text-night-700'}`}>
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Il tuo nome"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-night-200 text-night-900"
              />
              <input
                type="number"
                placeholder="Età"
                value={age}
                onChange={e => setAge(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-night-200 text-night-900"
              />
              <p className="text-sm text-night-600">Tipo di pelle?</p>
              <div className="flex gap-2">
                {['dry', 'oily', 'combination'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSkinType(s as typeof skinType)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      skinType === s
                        ? 'bg-sage-500 text-white'
                        : 'bg-white border border-night-200 text-night-700'
                    }`}
                  >
                    {s === 'dry' ? 'Secca' : s === 'oily' ? 'Grassa' : 'Mista'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm text-night-600 mb-3">Budget mensile per prodotti?</p>
              {[
                { id: 'low', label: 'Low Budget', desc: '~30€/mese', color: 'bg-emerald-50 border-emerald-500' },
                { id: 'medium', label: 'Medium Budget', desc: '~65€/mese', color: 'bg-blue-50 border-blue-500' },
                { id: 'elite', label: 'Elite Protocol', desc: '120€+/mese', color: 'bg-amber-50 border-amber-500' },
              ].map(b => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id as typeof budget)}
                  className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${
                    budget === b.id ? b.color + ' border-2' : 'bg-white border-2 border-night-200'
                  }`}
                >
                  <div>
                    <p className="font-medium text-night-700">{b.label}</p>
                    <p className="text-sm text-night-500">{b.desc}</p>
                  </div>
                  {budget === b.id && <CheckCircle2 className="w-5 h-5 text-sage-600" />}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full mt-8 py-3.5 rounded-xl bg-gradient-to-r from-sage-500 to-sage-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-sage-600 hover:to-sage-700 transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generazione...
              </>
            ) : step === 3 ? (
              'Genera Protocollo AI'
            ) : (
              'Continua'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-50 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-16 h-16 text-sage-500 animate-spin mb-4" />
        <p className="text-night-900 text-lg font-medium">Generazione del protocollo...</p>
        <p className="text-night-400 text-sm mt-2">Analisi in corso</p>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className={`min-h-screen safe-top safe-bottom pb-24 ${isDarkMode ? 'bg-night-900' : 'bg-night-50'}`}>
      <header className={`sticky top-0 z-30 px-5 py-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'} border-b ${isDarkMode ? 'border-night-700' : 'border-night-100'} safe-top`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>BioStack AI</span>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* HOME TAB */}
      {navTab === 'home' && (
        <div className="px-5 pt-4 pb-6">
          {/* Weekly Calendar */}
          <div className={`rounded-2xl p-4 mb-6 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium uppercase tracking-wide text-night-400">Questa Settimana</p>
              <div className="flex items-center gap-1">
                <Flame className={`w-3.5 h-3.5 ${streakDays > 0 ? 'text-orange-500' : 'text-night-400'}`} />
                <span className="text-xs font-medium text-night-600">{streakDays} giorni</span>
              </div>
            </div>
            <div className="flex justify-between">
              {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((day, index) => {
                const today = new Date().getDay();
                const dayIndex = today === 0 ? 6 : today - 1;
                const isToday = index === dayIndex;

                return (
                  <div key={index} className="flex flex-col items-center">
                    <span className={`text-[10px] font-medium mb-1.5 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`}>
                      {day}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isToday
                        ? 'bg-sage-500 text-white shadow-md shadow-sage-500/30'
                        : 'bg-night-50 dark:bg-night-700 text-night-400'
                    }`}>
                      <span className="text-xs font-bold">{isToday ? new Date().getDate() : '-'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Card */}
          <div className={`rounded-3xl shadow-card p-6 mb-6 ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide mb-1 text-night-400">Progresso Oggi</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{completedPercentage}%</p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke={isDarkMode ? '#374151' : '#f1f5f9'} strokeWidth="8" fill="none" />
                  <circle
                    cx="40" cy="40" r="32"
                    stroke="#0d9488"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={201.6}
                    strokeDashoffset={201.6 - (201.6 * completedPercentage) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-sage-500" />
                </div>
              </div>
            </div>

            {/* XP & Streak */}
            <div className="flex items-center gap-4 pt-4 border-t border-night-100 dark:border-night-700">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${streakDays > 0 ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-night-100 dark:bg-night-700'}`}>
                  <Flame className={`w-5 h-5 ${streakDays > 0 ? 'text-orange-500' : 'text-night-400'}`} />
                </div>
                <div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{streakDays}</p>
                  <p className="text-xs text-night-500">streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                  <Trophy className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{xpPoints} XP</p>
                  <p className="text-xs text-night-500">guadagnati</p>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-sage-50 to-emerald-50 dark:from-sage-900/20 dark:to-emerald-900/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sage-500" />
                  <span className="text-sm font-semibold text-sage-700 dark:text-sage-400">
                    Livello {levelInfo.level}: {levelInfo.name}
                  </span>
                </div>
                <span className="text-xs text-night-500">{xpPoints}/{levelInfo.nextXp} XP</span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-200'}`}>
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sage-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(levelInfo.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Routine Tabs */}
          <div className={`rounded-2xl p-1.5 shadow-card mb-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
            <div className="flex">
              <button
                onClick={() => setActiveTab('morning')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'morning'
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'text-night-500 hover:bg-night-50'
                }`}
              >
                <Sun className="w-4 h-4" />
                Mattina
              </button>
              <button
                onClick={() => setActiveTab('evening')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  activeTab === 'evening'
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'text-night-500 hover:bg-night-50'
                }`}
              >
                <Moon className="w-4 h-4" />
                Sera
              </button>
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-3">
            {(activeTab === 'morning' ? morningActivities : eveningActivities).map(activity => (
              <button
                key={activity.id}
                onClick={() => toggleActivity(activity.id, activeTab === 'morning')}
                className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 active:scale-[0.98] ${
                  activity.completed
                    ? 'bg-gradient-to-r from-sage-50 to-emerald-50 dark:from-sage-900/20 dark:to-emerald-900/20 border border-sage-200 dark:border-sage-800/30'
                    : isDarkMode
                      ? 'bg-night-800'
                      : 'bg-white shadow-card hover:shadow-card-hover'
                }`}
              >
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  activity.completed
                    ? 'bg-sage-500 border-sage-500 scale-110'
                    : isDarkMode
                      ? 'border-night-600'
                      : 'border-night-300'
                }`}>
                  {activity.completed && <CheckCircle2 className="w-4 h-4 text-white animate-fade-in-scale" />}
                </div>
                <div className="flex-1 text-left">
                  <p className={`font-medium transition-all duration-300 ${
                    activity.completed
                      ? 'text-sage-700 dark:text-sage-400'
                      : isDarkMode
                        ? 'text-white'
                        : 'text-night-900'
                  }`}>
                    {activity.name}
                  </p>
                  {activity.duration && (
                    <p className={`text-sm transition-all duration-300 ${
                      activity.completed
                        ? 'text-sage-500'
                        : 'text-night-400'
                    }`}>
                      {activity.duration}
                    </p>
                  )}
                </div>
                {activity.completed && (
                  <span className="px-2.5 py-1 rounded-full bg-sage-500/20 text-sage-600 dark:text-sage-400 text-xs font-medium animate-fade-in">
                    +{activity.xp} XP
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Growth Chart */}
          <div className="mt-6">
            {renderGrowthChart()}
          </div>

          {/* Progress Diary */}
          <div className={`mt-6 rounded-2xl shadow-card p-5 ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera className={`w-5 h-5 ${isDarkMode ? 'text-sage-400' : 'text-sage-500'}`} />
                <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Diario Progressi</h2>
              </div>
              {isPremium ? (
                <span className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-medium">
                  <Crown className="w-3 h-3 inline mr-1" />Pro
                </span>
              ) : (
                <span className="px-2 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/20 text-amber-500 text-xs font-medium">
                  <Lock className="w-3 h-3 inline mr-1" />Pro
                </span>
              )}
            </div>

            {isPremium ? (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => beforePhotoRef.current?.click()}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed transition-all ${
                      beforePhoto
                        ? 'border-sage-500'
                        : 'border-night-300 dark:border-night-600 hover:border-sage-400'
                    }`}
                  >
                    {beforePhoto ? (
                      <img src={beforePhoto} alt="Prima" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
                        <Upload className="w-8 h-8 mb-2 text-night-400" />
                        <span className="text-xs font-medium text-night-500">Giorno 1</span>
                        <span className="text-[10px] text-night-400">(Prima)</span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => afterPhotoRef.current?.click()}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed transition-all ${
                      afterPhoto
                        ? 'border-sage-500'
                        : 'border-night-300 dark:border-night-600 hover:border-sage-400'
                    }`}
                  >
                    {afterPhoto ? (
                      <img src={afterPhoto} alt="Dopo" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-night-700' : 'bg-night-50'}`}>
                        <Camera className="w-8 h-8 mb-2 text-night-400" />
                        <span className="text-xs font-medium text-night-500">Oggi</span>
                        <span className="text-[10px] text-night-400">(Dopo)</span>
                      </div>
                    )}
                  </button>
                </div>

                {beforePhoto && afterPhoto && renderComparisonSlider()}

                {beforePhoto && afterPhoto && (
                  <button
                    onClick={() => {
                      setIsAnalyzing(true);
                      setTimeout(() => {
                        setAnalysisResult({
                          symmetry: Math.floor(Math.random() * 8) + 10,
                          hydration: Math.floor(Math.random() * 15) + 20,
                          lines: Math.floor(Math.random() * 10) + 5,
                          glowUp: Math.floor(Math.random() * 20) + 15
                        });
                        setIsAnalyzing(false);
                      }, 3000);
                    }}
                    disabled={isAnalyzing}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-sage-500 to-sage-600 text-white font-medium flex items-center justify-center gap-2 mt-4"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analisi in corso...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Calcola Miglioramento AI
                      </>
                    )}
                  </button>
                )}

                {analysisResult && (
                  <div className="mt-4 p-4 rounded-xl bg-sage-50 dark:bg-sage-900/20">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-sage-500" />
                      <span className="font-semibold text-sage-600 dark:text-sage-400">Risultati Analisi AI</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-night-600 dark:text-night-300">Simmetria Mandibolare</span>
                        <span className="text-sage-600 font-bold">+{analysisResult.symmetry}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-night-600 dark:text-night-300">Idratazione</span>
                        <span className="text-sage-600 font-bold">+{analysisResult.hydration}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-night-600 dark:text-night-300">Riduzione Linee</span>
                        <span className="text-sage-600 font-bold">-{analysisResult.lines}%</span>
                      </div>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/30">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                          Glow Up Score: +{analysisResult.glowUp}% rispetto al Giorno 1
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <div className={`aspect-[4/3] ${isDarkMode ? 'bg-night-700' : 'bg-gradient-to-br from-night-100 to-night-50'} relative`}>
                  <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg mb-4">
                        <Crown className="w-8 h-8 text-white" />
                      </div>
                      <p className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                        Analisi AI Progressi
                      </p>
                      <p className="text-sm text-night-500 max-w-[200px]">
                        Sblocca per tracciare il tuo glow-up con confronto AI
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setNavTab('pro')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-night-900 font-semibold text-sm flex items-center justify-center gap-2 mt-4"
                >
                  <Crown className="w-4 h-4" />
                  Sblocca con Pro
                </button>
              </div>
            )}

            <input
              ref={beforePhotoRef}
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = event => setBeforePhoto(event.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <input
              ref={afterPhotoRef}
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = event => setAfterPhoto(event.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {navTab === 'products' && (
        <div className="px-5 pt-12 pb-6">
          <h1 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Il Tuo Stack</h1>
          <p className="text-night-400 text-sm mb-6">Prodotti consigliati per il tuo protocollo</p>

          {/* Search */}
          <div className={`relative mb-4 ${isDarkMode ? 'bg-night-800' : 'bg-white'} rounded-xl shadow-card`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-night-400" />
            <input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Tutti' },
              { id: 'skincare', label: 'Skincare' },
              { id: 'integrators', label: 'Integratori' },
              { id: 'tools', label: 'Tools' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setProductFilter(f.id as ProductFilter)}
                className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  productFilter === f.id
                    ? 'bg-sage-500 text-white'
                    : isDarkMode
                      ? 'bg-night-800 text-night-400'
                      : 'bg-white text-night-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="space-y-4">
            {filteredProducts.map(renderProductCard)}
          </div>
        </div>
      )}

      {/* PRO TAB */}
      {navTab === 'pro' && (
        isPremium ? (
          <div className="px-5 pt-12 pb-6">
            <h1 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
              Scansione AI Multi-Angolo
            </h1>
            <p className="text-night-400 text-sm mb-6">Analisi biometrica completa del viso</p>

            {/* Photo Upload Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Front Photo */}
              <div
                onClick={() => frontImageRef.current?.click()}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  frontImage
                    ? 'border-2 border-sage-500'
                    : 'border-2 border-dashed border-night-300 dark:border-night-600 hover:border-sage-400'
                }`}
              >
                {frontImage ? (
                  <>
                    <img src={frontImage} alt="Front" className="w-full h-full object-cover" />
                    {showBiometricOverlay && renderBiometricOverlay()}
                  </>
                ) : (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
                    <User className="w-12 h-12 mb-3 text-night-400" />
                    <span className="font-medium text-night-500">Fronte</span>
                    <span className="text-xs text-night-400">Foto frontale</span>
                  </div>
                )}
              </div>

              {/* Profile Photo */}
              <div
                onClick={() => profileImageRef.current?.click()}
                className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  profileImage
                    ? 'border-2 border-sage-500'
                    : 'border-2 border-dashed border-night-300 dark:border-night-600 hover:border-sage-400'
                }`}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
                    <User className="w-12 h-12 mb-3 text-night-400 transform rotate-90" />
                    <span className="font-medium text-night-500">Profilo</span>
                    <span className="text-xs text-night-400">Foto laterale</span>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={frontImageRef}
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = event => setFrontImage(event.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <input
              ref={profileImageRef}
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = event => setProfileImage(event.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />

            {/* Scan Button */}
            <button
              onClick={startBiometricScan}
              disabled={!frontImage || !profileImage || isScanning}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-sage-600 text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analisi in corso... {Math.round(scanProgress * 100)}%
                </>
              ) : (
                <>
                  <Scan className="w-6 h-6" />
                  Avvia Scansione Biometrica
                </>
              )}
            </button>

            {/* Progress Bar */}
            {isScanning && (
              <div className="mt-4">
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-200'}`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sage-500 transition-all duration-100"
                    style={{ width: `${scanProgress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Facial Report */}
            {facialReport && !isScanning && (
              <div className="mt-6 space-y-4">
                {/* Glow Up Score */}
                <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card text-center`}>
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-sage-500 to-emerald-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{facialReport.glowUpScore}</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                    Glow Up Score
                  </h3>
                  <p className="text-night-400 text-sm">Basato su {facialReport.faceShape} face analysis</p>
                </div>

                {/* Facial Metrics */}
                <div className={`rounded-2xl p-5 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
                  <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                    Analisi Biometrica
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-night-400 text-sm">Simmetria Facciale</span>
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.symmetry}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-200'}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-sage-500 to-emerald-500"
                          style={{ width: `${facialReport.symmetry}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-night-400 text-sm">Angolo Mandibola</span>
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.jawAngle}°</span>
                      </div>
                      <div className={`h-2 rounded-full ${isDarkMode ? 'bg-night-700' : 'bg-night-200'}`}>
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${Math.min(facialReport.jawAngle / 180 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-night-400 text-sm">Qualità Pelle</span>
                        <span className={`font-bold ${
                          facialReport.skinQuality === 'excellent' ? 'text-emerald-500' :
                          facialReport.skinQuality === 'good' ? 'text-sage-500' :
                          facialReport.skinQuality === 'fair' ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          {facialReport.skinQuality === 'excellent' ? 'Eccellente' :
                           facialReport.skinQuality === 'good' ? 'Buona' :
                           facialReport.skinQuality === 'fair' ? 'Discreta' : 'Da migliorare'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hair Recommendation */}
                <div className={`rounded-2xl p-5 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-purple-500" />
                    </div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                      Taglio Consigliato
                    </h4>
                  </div>
                  <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                    {facialReport.hairRecommendation}
                  </p>
                  <p className="text-night-400 text-sm">{facialReport.hairReason}</p>
                </div>

                {/* Beard Recommendation */}
                <div className={`rounded-2xl p-5 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-500" />
                    </div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                      Stile Barba
                    </h4>
                  </div>
                  <p className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                    {facialReport.beardRecommendation}
                  </p>
                  <p className="text-night-400 text-sm">{facialReport.beardReason}</p>
                </div>

                {/* Eyewear */}
                <div className={`rounded-2xl p-5 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                      Occhiali Ideali
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {facialReport.eyewearStyles.map(style => (
                      <span key={style} className="px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-400 text-sm font-medium">
                        {style}
                      </span>
                    ))}
                  </div>
                  <p className="text-night-400 text-sm">{facialReport.eyewearRecommendation}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Premium Paywall */
          <div className="px-5 pt-12 pb-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                BioStack Pro
              </h1>
              <p className="text-night-500">Sblocca il tuo potenziale di Glow-Up</p>
            </div>

            {/* Features */}
            <div className={`rounded-3xl p-6 mb-6 ${isDarkMode ? 'bg-night-800' : 'bg-white'} shadow-card`}>
              <h2 className={`font-semibold text-lg mb-5 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                Cosa ottieni con Pro
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center flex-shrink-0">
                    <Scan className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Scansione 3D Multi-Angolo</p>
                    <p className="text-sm text-night-500">Analisi fronte + profilo con overlay biometrico</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Analisi Taglio Capelli AI</p>
                    <p className="text-sm text-night-500">Raccomandazioni personalizzate per la tua forma</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Stile Barba & Occhiali</p>
                    <p className="text-sm text-night-500">Consigli stilistici su misura</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Slider Prima/Dopo Interattivo</p>
                    <p className="text-sm text-night-500">Confronto visivo con slider toccabile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 rounded-2xl p-4 mb-6 border border-red-100 dark:border-red-900/30">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm">
                  Offerta limitata: scade tra {formatCountdown(countdown)}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSubscriptionPlan('annual')}
                className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${
                  subscriptionPlan === 'annual'
                    ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-500'
                    : isDarkMode
                      ? 'bg-night-800 border-night-700'
                      : 'bg-white border-night-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Piano Annuale</p>
                  {subscriptionPlan === 'annual' && <CheckCircle2 className="w-6 h-6 text-sage-500" />}
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>59,99€<span className="text-sm font-normal text-night-500">/anno</span></p>
                <p className="text-sm text-night-500">Solo 4,99€/mese - Risparmi il 50%</p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700">Miglior Valore</span>
                  </span>
                </div>
              </button>

              <button
                onClick={() => setSubscriptionPlan('monthly')}
                className={`w-full p-5 rounded-2xl text-left transition-all border-2 ${
                  subscriptionPlan === 'monthly'
                    ? 'bg-sage-50 dark:bg-sage-900/20 border-sage-500'
                    : isDarkMode
                      ? 'bg-night-800 border-night-700'
                      : 'bg-white border-night-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-night-900'}`}>Piano Mensile</p>
                  {subscriptionPlan === 'monthly' && <CheckCircle2 className="w-6 h-6 text-sage-500" />}
                </div>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>9,99€<span className="text-sm font-normal text-night-500">/mese</span></p>
                <p className="text-sm text-night-500">Disdici quando vuoi</p>
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-sage-600 text-white font-bold text-lg flex items-center justify-center gap-3 hover:from-sage-600 hover:to-sage-700 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-sage-500/30"
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Attiva BioStack Pro
                </>
              )}
            </button>

            <p className="text-center text-xs text-night-400 mt-4">
              Pagamento sicuro. Cancella in qualsiasi momento.
            </p>
          </div>
        )
      )}

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-night-800' : 'bg-white'} border-t ${isDarkMode ? 'border-night-700' : 'border-night-100'} safe-bottom`}>
        <div className="flex">
          <button
            onClick={() => setNavTab('home')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              navTab === 'home' ? 'text-sage-600' : 'text-night-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button
            onClick={() => setNavTab('products')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              navTab === 'products' ? 'text-sage-600' : 'text-night-400'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Prodotti</span>
          </button>
          <button
            onClick={() => setNavTab('pro')}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all ${
              navTab === 'pro' ? 'text-sage-600' : 'text-night-400'
            }`}
          >
            <Crown className="w-5 h-5" />
            <span className="text-xs font-medium">BioStack Pro</span>
          </button>
        </div>
      </nav>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className={`fixed top-0 right-0 bottom-0 w-[85%] max-w-sm ${isDarkMode ? 'bg-night-800' : 'bg-white'} z-50 shadow-2xl overflow-y-auto`}>
            <div className="p-5 border-b border-night-100 dark:border-night-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{name}</h2>
                    <p className="text-sm text-night-500">{email}</p>
                  </div>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 rounded-full hover:bg-night-100 dark:hover:bg-night-700">
                  <X className="w-5 h-5 text-night-500" />
                </button>
              </div>
              {isPremium && (
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 text-xs font-medium">
                  <Crown className="w-3 h-3 inline mr-1" />Membro Pro
                </span>
              )}
            </div>

            <div className="p-5">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-night-700' : 'bg-night-50'} mb-3`}
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span className={isDarkMode ? 'text-white' : 'text-night-900'}>Dark Mode</span>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-all ${isDarkMode ? 'bg-sage-500' : 'bg-night-300'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${isDarkMode ? 'translate-x-4' : ''}`} />
                </div>
              </button>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setShowDashboard(false);
                  setIsDrawerOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-5 h-5" />
                <span>Esci</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
