import { useState, useRef } from 'react';
import {
  Scan, Upload, Shield, CheckCircle2, Loader2, Sparkles, Crown,
  User, Target, TrendingUp, Package, Brain
} from 'lucide-react';

interface FacialReport {
  faceShape: 'oval' | 'square' | 'diamond' | 'heart' | 'round' | 'oblong';
  symmetry: number;
  jawAngle: number;
  skinQuality: 'excellent' | 'good' | 'fair' | 'needs attention';
  hairRecommendation: string;
  hairReason: string;
  beardRecommendation: string;
  beardReason: string;
  eyewearRecommendation: string;
  eyewearStyles: string[];
}

interface ScanViewProps {
  isDarkMode: boolean;
  isPremium: boolean;
  language: 'it' | 'en';
  subscriptionPlan: 'annual' | 'monthly';
  setSubscriptionPlan: (plan: 'annual' | 'monthly') => void;
  onPayment: () => void;
  onViewProducts: () => void;
}

export default function ScanView({
  isDarkMode, isPremium, language, subscriptionPlan, setSubscriptionPlan, onPayment, onViewProducts
}: ScanViewProps) {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'uploaded' | 'scanning' | 'locked' | 'unlocked'>('idle');
  const [scanProgress, setScanProgress] = useState(0);
  const [facialReport, setFacialReport] = useState<FacialReport | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const frontImageRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  const handleFrontImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFrontImage(event.target?.result as string);
      if (profileImage) setScanState('uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
      if (frontImage) setScanState('uploaded');
    };
    reader.readAsDataURL(file);
  };

  const generateFacialReport = () => {
    const shapes: Array<'oval' | 'square' | 'diamond' | 'heart' | 'round' | 'oblong'> = ['oval', 'square', 'diamond', 'heart', 'round', 'oblong'];
    const faceShape = shapes[Math.floor(Math.random() * shapes.length)];
    const symmetry = Math.floor(Math.random() * 20) + 75;
    const jawAngle = Math.floor(Math.random() * 40) + 110;
    const skinQualities: Array<'excellent' | 'good' | 'fair' | 'needs attention'> = ['excellent', 'good', 'fair', 'needs attention'];
    const skinQuality = skinQualities[Math.floor(Math.random() * skinQualities.length)];

    const hairRecs: Record<string, { style: string; reason: string }> = {
      oval: { style: 'Textured Crop o Quiff Laterale', reason: 'La forma ovale e universalmente versatile. Un textured crop esalta gli zigomi.' },
      square: { style: 'Taper Fade con Curly Middle Part', reason: 'Il viso squadrato ha una mascella definita. Un fade alto riduce la larghezza alle tempie.' },
      diamond: { style: 'Side Swept Fringe o Pompadour', reason: 'Gli zigomi alti beneficiano di volume laterale che ammorbidisce i contorni.' },
      heart: { style: 'Medium Length Side Part', reason: 'La fronte ampia richiede equilibrio. Una frangia laterale riduce il volume frontale.' },
      round: { style: 'High Fade con Pompadour', reason: 'Il viso rotondo necessita di definizione verticale. Un fade alto allunga visivamente.' },
      oblong: { style: 'Side Part con Texture', reason: 'Il viso allungato richiede larghezza visuale per bilanciare.' }
    };

    const beardRecs: Record<string, { style: string; reason: string }> = {
      oval: { style: 'Full Beard Corta', reason: 'La forma ovale supporta quasi ogni stile.' },
      square: { style: 'Pizzetto Accennato', reason: 'La mascella squadrata e gia forte. Evita barbe piene.' },
      diamond: { style: 'Full Beard con Sideburns', reason: 'Gli zigomi sporgenti beneficiano di volume mascellare.' },
      heart: { style: 'Goatee Pieno', reason: 'Il mento appuntito necessita di volume.' },
      round: { style: 'Van Dyke', reason: 'Il viso rotondo richiede definizione verticale.' },
      oblong: { style: 'Sideburns Medi', reason: 'Il viso allungato necessita di larghezza.' }
    };

    const eyewearRecs: Record<string, { styles: string[]; desc: string }> = {
      oval: { styles: ['Aviator', 'Wayfarer'], desc: 'Forma ovale versa tile. Puoi permetterti quasi ogni stile.' },
      square: { styles: ['Round', 'Clubmaster'], desc: 'Occhiali rotondi ammorbidiscono gli angoli forti.' },
      diamond: { styles: ['Round', 'Cat-Eye'], desc: 'Montature rotonde bilanciano gli zigomi prominenti.' },
      heart: { styles: ['Wayfarer', 'Aviator'], desc: 'Stili con base ampia bilanciano la fronte.' },
      round: { styles: ['Rectangular', 'Geometric'], desc: 'Montature angolate aggiungono definizione.' },
      oblong: { styles: ['Oversized', 'Round'], desc: 'Montature ampie aggiungono larghezza visuale.' }
    };

    const hair = hairRecs[faceShape];
    const beard = beardRecs[faceShape];
    const eyewear = eyewearRecs[faceShape];

    setFacialReport({
      faceShape, symmetry, jawAngle, skinQuality,
      hairRecommendation: hair.style, hairReason: hair.reason,
      beardRecommendation: beard.style, beardReason: beard.reason,
      eyewearRecommendation: eyewear.desc, eyewearStyles: eyewear.styles
    });
  };

  const startBiometricScan = () => {
    setScanState('scanning');
    setScanProgress(0);

    const startTime = Date.now();
    const duration = 5000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setScanProgress(progress);

      if (progress >= 1) {
        clearInterval(interval);
        generateFacialReport();
        setScanState(isPremium ? 'unlocked' : 'locked');
      }
    }, 50);
  };

  const handlePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setScanState('unlocked');
      onPayment();
    }, 1500);
  };

  return (
    <div className={`px-5 pt-12 pb-6 ${isDarkMode ? 'bg-night-900' : 'bg-gradient-to-b from-night-50 to-white'}`}>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sage-500 to-emerald-600 flex items-center justify-center">
          <Scan className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
            {language === 'en' ? 'Biometric Scan' : 'Scansione Biometrica'}
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
            {language === 'en' ? '360deg facial analysis' : 'Analisi facciale a 360gradi'}
          </p>
        </div>
      </div>

      {/* Photo Upload Section */}
      {(scanState === 'idle' || scanState === 'uploaded') && (
        <div className="mt-6 space-y-4">
          <div className={`card-premium p-4 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-sage-900/30' : 'bg-sage-100'}`}>
                <Sparkles className={`w-4 h-4 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} />
              </div>
              <div>
                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                  {language === 'en' ? 'Upload two photos for accurate analysis' : 'Carica due foto per un\'analisi accurata'}
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
                  {language === 'en' ? 'Front + Profile views' : 'Frontale + Profilo'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Front Photo */}
            <div onClick={() => frontImageRef.current?.click()} className={`scan-card ${frontImage ? 'active' : ''} ${isDarkMode ? 'dark' : ''} cursor-pointer`}>
              {frontImage ? (
                <div className="relative aspect-[3/4]">
                  <img src={frontImage} alt="Front" className="w-full h-full object-cover rounded-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">{language === 'en' ? 'Front' : 'Frontale'}</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex flex-col items-center justify-center p-4">
                  <svg className={`w-16 h-20 mb-3 ${isDarkMode ? 'text-night-500' : 'text-night-300'}`} viewBox="0 0 64 80" fill="none">
                    <ellipse cx="32" cy="32" rx="24" ry="28" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="22" cy="26" r="2" fill="currentColor"/>
                    <circle cx="42" cy="26" r="2" fill="currentColor"/>
                  </svg>
                  <Upload className={`w-5 h-5 mb-1 ${isDarkMode ? 'text-night-400' : 'text-night-400'}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{language === 'en' ? 'Front' : 'Frontale'}</p>
                </div>
              )}
            </div>

            {/* Profile Photo */}
            <div onClick={() => profileImageRef.current?.click()} className={`scan-card ${profileImage ? 'active' : ''} ${isDarkMode ? 'dark' : ''} cursor-pointer`}>
              {profileImage ? (
                <div className="relative aspect-[3/4]">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span className="text-white text-xs font-medium">{language === 'en' ? 'Profile' : 'Profilo'}</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-[3/4] flex flex-col items-center justify-center p-4">
                  <svg className={`w-16 h-20 mb-3 ${isDarkMode ? 'text-night-500' : 'text-night-300'}`} viewBox="0 0 64 80" fill="none">
                    <path d="M48 8 Q20 12 16 36 Q14 60 24 76" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="20" cy="26" r="2" fill="currentColor"/>
                  </svg>
                  <Upload className={`w-5 h-5 mb-1 ${isDarkMode ? 'text-night-400' : 'text-night-400'}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{language === 'en' ? 'Profile' : 'Profilo'}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={startBiometricScan}
            disabled={!frontImage || !profileImage}
            className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
              frontImage && profileImage
                ? 'bg-gradient-to-r from-sage-500 to-emerald-500 text-white hover:shadow-lg active:scale-[0.98]'
                : `${isDarkMode ? 'bg-night-700 text-night-500' : 'bg-night-100 text-night-400'} cursor-not-allowed`
            }`}
          >
            <Scan className="w-5 h-5" />
            {language === 'en' ? 'Start Biometric Scan' : 'Avvia Scansione'}
          </button>

          <div className={`flex items-center justify-center gap-2 py-2 ${isDarkMode ? 'text-night-500' : 'text-night-400'}`}>
            <Shield className="w-4 h-4" />
            <span className="text-xs">{language === 'en' ? 'Private processing' : 'Elaborazione privata'}</span>
          </div>
        </div>
      )}

      {/* Scanning Animation */}
      {scanState === 'scanning' && (
        <div className="mt-6">
          <div className={`card-premium p-6 ${isDarkMode ? 'dark' : ''}`}>
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" stroke={isDarkMode ? '#374151' : '#f1f5f9'} strokeWidth="8" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="url(#grad)" strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray={351.86} strokeDashoffset={351.86 - (351.86 * scanProgress)} className="transition-all duration-100" />
                  <defs><linearGradient id="grad"><stop stopColor="#0d9488"/><stop offset="1" stopColor="#10b981"/></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className={`w-10 h-10 text-sage-500 ${scanProgress < 0.5 ? 'animate-pulse' : ''}`} />
                </div>
              </div>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>
                {language === 'en' ? 'Analyzing...' : 'Analisi...'}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>
                {scanProgress < 0.25 ? (language === 'en' ? 'Detecting landmarks...' : 'Rilevamento landmark...') :
                 scanProgress < 0.5 ? (language === 'en' ? 'Calculating symmetry...' : 'Calcolo simmetria...') :
                 scanProgress < 0.75 ? (language === 'en' ? 'Analyzing jaw...' : 'Analisi mascella...') :
                 (language === 'en' ? 'Generating report...' : 'Generazione report...')}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: language === 'en' ? 'Face Shape' : 'Forma Viso', p: 0.25 },
                { label: language === 'en' ? 'Symmetry' : 'Simmetria', p: 0.5 },
                { label: language === 'en' ? 'Jaw Angle' : 'Angolo Mascella', p: 0.75 },
                { label: language === 'en' ? 'Recommendations' : 'Raccomandazioni', p: 1.0 }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${scanProgress >= s.p ? 'bg-sage-500' : isDarkMode ? 'bg-night-700' : 'bg-night-100'}`}>
                    {scanProgress >= s.p ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-night-500' : 'bg-night-300'}`} />}
                  </div>
                  <span className={`text-sm ${scanProgress >= s.p ? (isDarkMode ? 'text-white' : 'text-night-900') : (isDarkMode ? 'text-night-500' : 'text-night-400')}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paywall */}
      {scanState === 'locked' && !isPremium && facialReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-3xl p-6 animate-fade-in-scale ${isDarkMode ? 'bg-night-800' : 'bg-white'}`}>
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Analysis Complete!' : 'Analisi Completata!'}</h3>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Unlock your personalized report' : 'Sblocca il tuo report personalizzato'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Face Shape' : 'Forma'}</p>
                <p className={`font-bold capitalize ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.faceShape}</p>
              </div>
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-night-700' : 'bg-sage-50'}`}>
                <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Symmetry' : 'Simmetria'}</p>
                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.symmetry}%</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <button onClick={() => setSubscriptionPlan('annual')} className={`w-full p-4 rounded-2xl text-left transition-all ${subscriptionPlan === 'annual' ? `${isDarkMode ? 'bg-sage-900/30 border-sage-500' : 'bg-sage-50 border-sage-500'} border-2` : `${isDarkMode ? 'bg-night-700' : 'bg-night-50'} border-2 border-transparent`}`}>
                <div className="flex justify-between mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Annual' : 'Annuale'}</span>
                  {subscriptionPlan === 'annual' && <CheckCircle2 className="w-5 h-5 text-sage-500" />}
                </div>
                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>59,99eur/{language === 'en' ? 'year' : 'anno'}</p>
              </button>
              <button onClick={() => setSubscriptionPlan('monthly')} className={`w-full p-4 rounded-2xl text-left transition-all ${subscriptionPlan === 'monthly' ? `${isDarkMode ? 'bg-sage-900/30 border-sage-500' : 'bg-sage-50 border-sage-500'} border-2` : `${isDarkMode ? 'bg-night-700' : 'bg-night-50'} border-2 border-transparent`}`}>
                <div className="flex justify-between mb-1">
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Monthly' : 'Mensile'}</span>
                  {subscriptionPlan === 'monthly' && <CheckCircle2 className="w-5 h-5 text-sage-500" />}
                </div>
                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>9,99eur/{language === 'en' ? 'mo' : 'mese'}</p>
              </button>
            </div>

            <button onClick={handlePayment} disabled={isProcessingPayment} className="w-full py-4 rounded-2xl bg-gradient-to-r from-sage-500 to-emerald-500 text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70">
              {isProcessingPayment ? <><Loader2 className="w-5 h-5 animate-spin" />{language === 'en' ? 'Processing...' : 'Elaborazione...'}</> : <><Crown className="w-5 h-5" />{language === 'en' ? 'Unlock Report' : 'Sblocca Report'}</>}
            </button>
          </div>
        </div>
      )}

      {/* Full Report */}
      {(scanState === 'unlocked' || (scanState === 'locked' && isPremium)) && facialReport && (
        <div className="mt-6 space-y-4 animate-fade-in">
          <div className={`card-premium p-4 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sage-500" />
                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Analysis Complete' : 'Analisi Completata'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-sage-900/30 text-sage-400' : 'bg-sage-100 text-sage-700'}`}>PRO</span>
            </div>
          </div>

          {/* Facial Structure */}
          <div className={`card-premium overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-night-700' : 'border-night-100'}`}>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-sage-500" />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Facial Structure' : 'Struttura Facciale'}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-16 rounded-full border-2 ${isDarkMode ? 'border-night-500 bg-night-700' : 'border-night-300 bg-night-100'}`} />
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Detected Shape' : 'Forma Rilevata'}</p>
                  <p className={`text-xl font-bold capitalize ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.faceShape}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={`metric-card ${isDarkMode ? 'dark' : ''}`}>
                  <div className="flex items-center gap-2 mb-1"><Target className={`w-4 h-4 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} /><span className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Symmetry' : 'Simmetria'}</span></div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.symmetry}%</p>
                  <div className={`h-1.5 rounded-full mt-2 ${isDarkMode ? 'bg-night-600' : 'bg-night-200'}`}><div className="h-1.5 rounded-full bg-gradient-to-r from-sage-500 to-emerald-500" style={{ width: `${facialReport.symmetry}%` }} /></div>
                </div>
                <div className={`metric-card ${isDarkMode ? 'dark' : ''}`}>
                  <div className="flex items-center gap-2 mb-1"><TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-sage-400' : 'text-sage-600'}`} /><span className={`text-xs ${isDarkMode ? 'text-night-400' : 'text-night-500'}`}>{language === 'en' ? 'Jaw Angle' : 'Angolo Mascella'}</span></div>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.jawAngle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hair */}
          <div className={`card-premium overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-night-700' : 'border-night-100'}`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Hair Styling' : 'Capelli'}</h3>
            </div>
            <div className="p-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-sage-400' : 'text-amber-700'}`}>{language === 'en' ? 'Recommended' : 'Consigliato'}</p>
              <p className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.hairRecommendation}</p>
              <p className={`text-xs ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{facialReport.hairReason}</p>
            </div>
          </div>

          {/* Beard */}
          <div className={`card-premium overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-night-700' : 'border-night-100'}`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Beard & Grooming' : 'Beard'}</h3>
            </div>
            <div className="p-4">
              <p className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{facialReport.beardRecommendation}</p>
              <p className={`text-xs ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{facialReport.beardReason}</p>
            </div>
          </div>

          {/* Eyewear */}
          <div className={`card-premium overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
            <div className={`p-4 border-b ${isDarkMode ? 'border-night-700' : 'border-night-100'}`}>
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-night-900'}`}>{language === 'en' ? 'Eyewear' : 'Occhiali'}</h3>
            </div>
            <div className="p-4">
              <div className="flex justify-center gap-3 mb-3">
                {facialReport.eyewearStyles.map((style, i) => (
                  <div key={i} className={`w-12 h-6 rounded-full border-2 ${isDarkMode ? 'border-sage-500' : 'border-sage-400'}`}>
                    <div className={`w-6 h-4 mx-auto mt-0.5 rounded-full border ${isDarkMode ? 'border-night-500' : 'border-night-400'}`} />
                  </div>
                ))}
              </div>
              <p className={`text-xs text-center ${isDarkMode ? 'text-night-300' : 'text-night-600'}`}>{facialReport.eyewearRecommendation}</p>
            </div>
          </div>

          <button onClick={onViewProducts} className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 ${isDarkMode ? 'bg-night-700 text-white hover:bg-night-600' : 'bg-night-900 text-white hover:bg-night-800'}`}>
            <Package className="w-5 h-5" />
            {language === 'en' ? 'View Recommended Products' : 'Vedi Prodotti Consigliati'}
          </button>
        </div>
      )}

      <input ref={frontImageRef} type="file" accept="image/*" onChange={handleFrontImageUpload} className="hidden" />
      <input ref={profileImageRef} type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
    </div>
  );
}
